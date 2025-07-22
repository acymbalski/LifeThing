import { DeskThingClientConfig, LoggingLevel } from "../../../config/deskthing.config.types";
import { useClientStore } from "../stores/clientStore";
import { ClientLogger } from "./clientLogger";
import { ClientMessageBus } from "./clientMessageBus";

type callback = (data: any) => void | Promise<void>;

type log = { level: LoggingLevel, message: string, data: any[] }

export class ClientService {
  private static responseHandlers: Record<string, callback[]> = {};
  private static isInitialized = false;
  private static logCache: log[] = [] 

  static initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    ClientLogger.debug("Initializing the wrapper...");
    ClientMessageBus.subscribe("client:response", async (data: any) => {
      const handlers = ClientService.responseHandlers[data.type];
      if (handlers && Array.isArray(handlers)) {
        try {

          await Promise.all(handlers.map((handler) => {
            try {
              handler(data.payload)
            } catch (error) {
              this.log('error', 'Error in settings callback:', error)
            }
          }));
        } catch (error) {
          this.log('error', 'Error when processing client:response with the data', error)
        } finally {
          ClientService.responseHandlers[data.type] = [];
        }
      }
    });

    // Fetch client configuration on startup
    this.requestClientConfig((config) => {
      
      if (!config) {
        this.logCache.forEach((log) => {
          console.log(log.level, log.message, ...log.data)
        })
      }

      if (this.logCache.length > 0) {
        this.logCache.forEach((log) => {
          this.log(log.level, log.message, ...log.data)
        })
        this.logCache = []
      }
      useClientStore.getState().updateConfig(config)
      ClientMessageBus.initialize(`ws://${window.location.hostname}:${config.linkPort}`);
      ClientLogger.debug("Client config loaded:", config);
    });
  }

  static requestClientConfig(callback: (data: DeskThingClientConfig) => void) {
    fetch(`http://${window.location.hostname}:${window.location.port}/config`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(config => {
        callback(config)
      })
      .catch(error => {
        console.error('Error fetching client config:', error)
        callback(null)
      })
  }

  static requestServerData(callback: (data: any) => void) {
    if (!this.responseHandlers["data"]) {
      this.responseHandlers["data"] = [];
    }

    this.responseHandlers["data"].push(callback);

    if (this.responseHandlers["data"].length === 1) {
      ClientMessageBus.publish("client:request", { type: "getData" });
    }
  }

  static requestManifest(callback: (data: any) => void) {
    if (!this.responseHandlers["manifest"]) {
      this.responseHandlers["manifest"] = [];
    }
    
    this.responseHandlers["manifest"].push(callback);
    
    if (this.responseHandlers["manifest"].length === 1) {
      ClientMessageBus.publish("client:request", { type: "getManifest" });
    }
  }
  static requestSettings(callback: (data: any) => void) {
    if (!this.responseHandlers["settings"]) {
      this.responseHandlers["settings"] = [];
    }

    this.responseHandlers["settings"].push(callback);

    // Only send the request if there are handlers and no request is pending
    if (this.responseHandlers["settings"].length === 1) {
      // Only send if this is the first handler
      ClientMessageBus.publish("client:request", { type: "getSettings" });
    }
  }

  static sendToServer(data: any) {
    ClientMessageBus.publish("client:request", data);
  }

  static sendToApp(data: any) {

    if (!data.clientId) {
      data.clientId = useClientStore.getState().clientId || '1234567890'
    }

    ClientMessageBus.publish("app:data", { ...data, clientId: data.clientId || '1234567890' });
  }

  private static shouldLog(
    msgLevel: LoggingLevel,
    configLevel: LoggingLevel
  ): boolean {
    const levels = ["silent", "error", "warn", "info", "debug"];
    const msgLevelIndex = levels.indexOf(msgLevel);
    const configLevelIndex = levels.indexOf(configLevel);

    // If either level is not found, default to showing the message
    if (msgLevelIndex === -1 || configLevelIndex === -1) return true;

    // Only show messages that are at or above the configured level
    return msgLevelIndex <= configLevelIndex;
  }

  static log(level: LoggingLevel, message: string, ...data: any[]) {
    // Only log if the level is appropriate based on config
    const clientConfig = useClientStore.getState().config
    if (clientConfig.logging.level == undefined) {
      this.logCache.push({ level, message, data })

      return
    }

    if (this.shouldLog(level, clientConfig.logging.level)) {
      // Local console logging
      switch (level) {
        case "debug":
          console.debug(
            "\x1b[36m%s\x1b[0m",
            `${clientConfig.logging.prefix} ${message}`,
            ...data
          ); // Cyan
          break;
        case "info":
          console.info(
            "\x1b[90m%s\x1b[0m",
            `${clientConfig.logging.prefix} ${message}`,
            ...data
          ); // Gray
          break;
        case "warn":
          console.warn(
            "\x1b[33m%s\x1b[0m",
            `${clientConfig.logging.prefix} ${message}`,
            ...data
          ); // Yellow
          break;
        case "error":
          console.error(
            "\x1b[31m%s\x1b[0m",
            `${clientConfig.logging.prefix} ${message}`,
            ...data
          ); // Red
          break;
        default:
          console.log(
            "\x1b[32m%s\x1b[0m",
            `${clientConfig.logging.prefix} ${message}`,
            ...data
          ); // Green
      }

      // Remote logging if enabled
      // if (config.logging.enableRemoteLogging) {
      //   this.sendToServer({
      //     type: 'clientLog',
      //     payload: { level, message, data }
      //   })
      // }
    }
  }
}
