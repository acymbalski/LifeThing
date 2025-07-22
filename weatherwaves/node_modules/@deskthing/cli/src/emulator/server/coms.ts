import { ServerService } from "../services/serverService";
import { ServerMessageBus } from "./serverMessageBus";
import { Logger } from "../services/logger";
import {
  AppSettings,
  Client,
  LOGGING_LEVELS,
  APP_REQUESTS,
  DESKTHING_EVENTS,
  SongEvent,
  AppToDeskThingData,
  AUDIO_REQUESTS,
  MusicEventPayloads,
  DeskThingToAppCore,
  ConnectionState,
  ClientConnectionMethod,
} from "@deskthing/types";
import { DeskThingConfig } from "../../config/deskthing.config";
import { exec } from "child_process";
import { MusicService } from "../services/musicService"

type HandlerFunction<
  T extends APP_REQUESTS | SongEvent | "default",
  R extends Extract<AppToDeskThingData, { type: T }>["request"] | string = string
> = (
  app: string,
  appData: Extract<AppToDeskThingData | MusicEventPayloads, { type: T; request?: R }>
) => void;

type TypeHandler = {
  [key in APP_REQUESTS | SongEvent | "default"]: RequestHandler<key>;
};

type RequestHandler<T extends APP_REQUESTS | SongEvent | "default"> = {
  [key in Extract<AppToDeskThingData | MusicEventPayloads, { type: T }>["request"] | "default"]?: (
    app: string,
    data: Extract<AppToDeskThingData | MusicEventPayloads, { type: T; request?: key }>
  ) => void;
};

const serverService = new ServerService();

let Data: {
  data: { [key: string]: any };
  settings: AppSettings;
} = {
  data: {},
  settings: {},
};

export const getServerData = () => Data;

export const handleDataFromApp = async (
  app: string,
  appData: any
): Promise<void> => {
  if (Object.values(APP_REQUESTS).includes(appData.type as APP_REQUESTS)) {
    try {
      const handler =
        handleData[appData.type as APP_REQUESTS] || handleData["default"];
      const requestHandler =
        handler[appData.request || "default"] || handler["default"];
      if (!requestHandler) {
        Logger.warn(
          `No handler found for request ${appData.request} in ${appData.type}`
        );
        handleRequestMissing(app, appData);
        return;
      }
      requestHandler(app, appData as any);
    } catch (error) {
      Logger.error("Error in handleDataFromApp:", error);
    }
  } else {
    Logger.error(
      "Unknown event type:",
      appData.type,
      " with request ",
      appData.request
    );
  }
};
/**
 * Logs a warning message when an app sends an unknown data type or request.
 *
 * @param {string} app - The name of the app that sent the unknown data.
 * @param {FromAppData} appData - The data received from the app.
 */
const handleRequestMissing: HandlerFunction<any, any> = (app: string, appData: any) => {
  Logger.warn(
    `[handleComs]: App ${app} sent unknown data type: ${
      appData.type
    } and request: ${appData.request}, with payload ${
      appData.payload
        ? JSON.stringify(appData.payload).length > 1000
          ? "[Large Payload]"
          : JSON.stringify(appData.payload)
        : "undefined"
    }`,
    app
  );
};

const handleRequestSetSettings: HandlerFunction<
  APP_REQUESTS.SET,
  "settings"
> = async (app, appData) => {
  Logger.info("Simulating adding settings");
  Logger.debug("Settings being added: ", appData.payload);
  const appSettings = appData.payload as AppSettings;
  const rebuiltSettings: AppSettings = Object.fromEntries(
    Object.entries(appSettings).map(([key, setting]) => {
      return [
        key,
        {
          ...setting,
          value:
            DeskThingConfig.development?.server?.mockData?.settings[key] ??
            setting.value,
        },
      ];
    })
  );
  Logger.debug(
    "Rebuilt Settings with mocked data. Setting to: ",
    rebuiltSettings
  );
  Data.settings = { ...Data.settings, ...rebuiltSettings };

  // Simulate loading before settings are "submitted" and sent back
  await new Promise((resolve) => setTimeout(resolve, 5000));
  Logger.debug("Sending settings back to the server");
  ServerMessageBus.notify("app:data", {
    type: "settings",
    payload: rebuiltSettings,
  });
};

const handleRequestSetData: HandlerFunction<APP_REQUESTS.SET, "data"> = async (
  app,
  appData
) => {
  Logger.info("Simulating adding data");
  Logger.debug("Data being added: ", Data.data);
  Data.data = { ...Data.data, ...appData.payload };
};

/**
 * Handles a request to set data for an app.
 *
 * @param {string} app - The name of the app requesting the data set.
 * @param {any} appData - The payload data to be set.
 * @returns {Promise<void>} - A Promise that resolves when the data has been set.
 */
const handleRequestSetAppData: HandlerFunction<
  APP_REQUESTS.SET,
  "appData"
> = async (app: string, appData): Promise<void> => {
  if (!appData.payload) return;
  const { settings, ...data } = appData.payload;

  Data = {
    data: { ...Data.data, ...data },
    settings: { ...Data.settings, ...settings },
  };
};

/**
 * Handles a request to open an authentication window.
 *
 * @param {any} appData - The payload data containing information for the authentication window.
 * @returns {Promise<void>} - A Promise that resolves when the authentication window has been opened.
 */
const handleRequestOpen: HandlerFunction<APP_REQUESTS.OPEN> = async (
  _app,
  appData
) => {
  Logger.debug(`[handleOpen]: Opening ${appData.payload}`);

  const encodedUrl = encodeURI(appData.payload);

  Logger.info(
    `[openUrl]: If your browser doesn't automatically open, try manually clicking the url:\n\n${encodedUrl}\n\n`
  );

  try {
    if (process.platform === "win32") {
      // For Windows, use the shell option to avoid command line parsing issues
      exec(`start "" "${encodedUrl}"`);
    } else if (process.platform === "darwin") {
      exec(`open '${encodedUrl}'`);
    } else {
      exec(`xdg-open '${encodedUrl}'`);
    }
    Logger.debug(`URL opening command executed successfully`);
  } catch (error) {
    Logger.error(`Error opening URL: ${error.message}`);
  }
};

/**
 * Handles a request to log data from an app.
 *
 * @param {string} app - The name of the app that sent the log request.
 * @param {FromAppData} appData - The data received from the app, including the log type and payload.
 * @returns {void}
 */
const handleRequestLog: HandlerFunction<APP_REQUESTS.LOG> = (
  app,
  appData
) => {
  Logger.clientLog(appData.request as any, typeof appData.payload === "object" ? JSON.stringify(appData.payload) : appData.payload);
};
/**
 * Handles a request to add a new key to the key map store.
 *
 * @param {string} app - The name of the app requesting the key addition.
 * @param {any} appData - The payload data containing the key information to be added.
 * @returns {Promise<void>} - A Promise that resolves when the key has been added.
 */
const handleRequestKeyAdd: HandlerFunction<APP_REQUESTS.KEY> = async (
  app,
  appData
): Promise<void> => {
  Logger.warn("Key data isn't supported");
  Logger.debug("Received", appData.payload);
};
/**
 * Handles a request to remove a key from the key map store.
 *
 * @param {string} app - The name of the app requesting the key removal.
 * @param {any} appData - The payload data containing the ID of the key to be removed.
 * @returns {Promise<void>} - A Promise that resolves when the key has been removed.
 */
const handleRequestKeyRemove: HandlerFunction<APP_REQUESTS.KEY> = async (
  app,
  appData
): Promise<void> => {
  Logger.warn("Key data isn't supported");
  Logger.debug("Received", appData.payload);
};
/**
 * Handles a request to trigger a key in the key map store.
 *
 * @param {string} app - The name of the app requesting the key trigger.
 * @param {any} appData - The payload data containing the ID and mode of the key to be triggered.
 * @returns {Promise<void>} - A Promise that resolves when the key has been triggered.
 */
const handleRequestKeyTrigger: HandlerFunction<APP_REQUESTS.KEY> = async (
  app,
  appData
): Promise<void> => {
  Logger.warn("Key data isn't supported");
  Logger.debug("Received", appData.payload);
};
/**
 * Handles a request to run an action in the key map store.
 *
 * @param {string} app - The name of the app requesting the action run.
 * @param {any} appData - The payload data containing the ID of the action to be run.
 * @returns {Promise<void>} - A Promise that resolves when the action has been run.
 */
const handleRequestActionRun: HandlerFunction<APP_REQUESTS.ACTION> = async (
  app,
  appData
): Promise<void> => {
  Logger.warn("Action data isn't supported");
  Logger.debug("Received", appData.payload);
};
/**
 * Handles a request to update the icon of an action in the key map store.
 *
 * @param {string} app - The name of the app requesting the action icon update.
 * @param {any} appData - The payload data containing the ID of the action and the new icon.
 * @returns {Promise<void>} - A Promise that resolves when the action icon has been updated.
 */
const handleRequestActionUpdate: HandlerFunction<APP_REQUESTS.ACTION> = async (
  app,
  appData
): Promise<void> => {
  Logger.warn("Action data isn't supported");
  Logger.debug("Received", appData.payload);
};
/**
 * Handles a request to remove an action from the key map store.
 *
 * @param {string} app - The name of the app requesting the action removal.
 * @param {any} appData - The payload data containing the ID of the action to be removed.
 * @returns {Promise<void>} - A Promise that resolves when the action has been removed.
 */
const handleRequestActionRemove: HandlerFunction<APP_REQUESTS.ACTION> = async (
  app,
  appData
): Promise<void> => {
  Logger.warn("Action data isn't supported");
  Logger.debug("Received", appData.payload);
};
/**
 * Handles a request to add a new action to the key map store.
 *
 * @param {string} app - The name of the app requesting the action addition.
 * @param {any} appData - The payload data containing the details of the action to be added.
 * @returns {Promise<void>} - A Promise that resolves when the action has been added.
 */
const handleRequestActionAdd: HandlerFunction<APP_REQUESTS.ACTION> = async (
  app,
  appData
): Promise<void> => {
  Logger.warn("Action data isn't supported");
  Logger.debug("Received", appData.payload);
};

/**
 * Handles a request to retrieve data for a specific app.
 *
 * @param {string} app - The name of the app requesting the data.
 * @returns {Promise<void>} - A Promise that resolves when the data has been sent to the app.
 */
const handleRequestGetData: HandlerFunction<APP_REQUESTS.GET, 'data'> = async (
  app
): Promise<void> => {
  Logger.info(`[handleAppData]: App is requesting data`);
  Logger.debug(`[handleAppData]: Returning Data:`, Data.data);
  ServerMessageBus.notify("app:data", { type: "data", payload: Data.data });
};

/**
 * Handles a request to delete data for a specific app.
 *
 * @param {string} app - The name of the app requesting the settings.
 * @returns {Promise<void>} - A Promise that resolves when the settings have been sent to the app.
 */
const handleRequestDelData: HandlerFunction<APP_REQUESTS.DELETE, 'data'> = async (
  app,
  appData
): Promise<void> => {
  Logger.info(
    `[handleAppData]: ${app} is deleting data: ${appData.payload.toString()}`
  );
  if (
    !appData.payload ||
    (typeof appData.payload !== "string" && !Array.isArray(appData.payload))
  ) {
    Logger.info(
      `[handleAppData]: Cannot delete data because ${appData.payload.toString()} is not a string or string[]`
    );
    return;
  }
  Data.data = Object.fromEntries(
    Object.entries(Data.data).filter(([key]) => !appData.payload.includes(key))
  );
};

const handleRequestGetConfig: HandlerFunction<APP_REQUESTS.GET, 'config'> = async (
  app
): Promise<void> => {
  ServerMessageBus.notify("app:data", { type: "config", payload: {} });
  Logger.warn(
    `[handleAppData]: ${app} tried accessing "Config" data type which is depreciated and no longer in use!`
  );
};

/**
 * Handles a request to retrieve the settings for a specific app.
 *
 * @param {string} app - The name of the app requesting the settings.
 * @returns {Promise<void>} - A Promise that resolves when the settings have been sent to the app.
 */
const handleRequestGetSettings: HandlerFunction<APP_REQUESTS.GET, 'settings'> = async (
  app
): Promise<void> => {
  Logger.info(`[handleAppData]: App is requesting settings`);
  Logger.debug(`[handleAppData]: Returning Settings:`, Data.settings);
  ServerMessageBus.notify("app:data", {
    type: "settings",
    payload: Data.settings,
  });
};

/**
 * Handles a request to delete settings for a specific app.
 *
 * @param {string} app - The name of the app requesting the settings.
 * @returns {Promise<void>} - A Promise that resolves when the settings have been sent to the app.
 */
const handleRequestDelSettings: HandlerFunction<APP_REQUESTS.DELETE, 'settings'> = async (
  app,
  appData
): Promise<void> => {
  Logger.info(
    `[handleAppData]: ${app} is deleting settings: ${appData.payload.toString()}`
  );
  if (
    !appData.payload ||
    (typeof appData.payload !== "string" && !Array.isArray(appData.payload))
  ) {
    Logger.warn(
      `[handleAppData]: Cannot delete settings because ${appData.payload.toString()} is not a string or string[]`
    );
    return;
  }
  Data.data = Object.fromEntries(
    Object.entries(Data.settings).filter(
      ([key]) => !appData.payload.includes(key)
    )
  );
};

/**
 * Handles a request to retrieve input data for a specific app.
 *
 * This function sends an IPC message to the renderer process to display a form and request user data. Once the user data is received, it is sent back to the app via a message.
 *
 * @param {string} app - The name of the app requesting the input data.
 * @param {object} appData - Additional data associated with the request.
 * @returns {Promise<void>} - A Promise that resolves when the input data has been sent to the app.
 */
const handleRequestGetInput: HandlerFunction<APP_REQUESTS.GET, 'input'> = async (
  app,
  appData
) => {
  const templateData = Object.keys(appData.payload).reduce((acc, key) => {
    acc[key] = "arbData";
    return acc;
  }, {});
  Logger.info(`[handleAppData]: App is requesting input`);
  Logger.debug(`[handleAppData]: Returning Input:`, templateData);
  ServerMessageBus.notify("app:data", { type: "input", payload: templateData });
};

const handleConnectionsRequest: HandlerFunction<APP_REQUESTS.GET, 'connections'> = async (
  app
) => {
  Logger.info(`[handleAppData]: App is requesting connections`);
  const sampleClient: Client = {
    clientId: "sample-id",
    connected: false,
    meta: {},
    identifiers: {
      adb: {
        id: "sample-provider",
        capabilities: [],
        method: ClientConnectionMethod.Unknown,
        providerId: 'sample-provider',
        active: false,
      }
    },
    connectionState: ConnectionState.Disconnected,
    timestamp: Date.now(),
    currentApp: app,
  };
  Logger.debug(`[handleAppData]: Returning Connections:`, sampleClient);
  ServerMessageBus.notify("app:data", {
    type: DESKTHING_EVENTS.CLIENT_STATUS,
    request: "connections",
    payload: [sampleClient],
  } as DeskThingToAppCore);
};

const handleGet: RequestHandler<APP_REQUESTS.GET> = {
  data: handleRequestGetData,
  config: handleRequestGetConfig,
  settings: handleRequestGetSettings,
  input: handleRequestGetInput,
  connections: handleConnectionsRequest,
};
const handleSet: RequestHandler<APP_REQUESTS.SET> = {
  settings: handleRequestSetSettings,
  data: handleRequestSetData,
  appData: handleRequestSetAppData,
  default: handleRequestMissing,
};
const handleDelete: RequestHandler<APP_REQUESTS.DELETE> = {
  settings: handleRequestDelSettings,
  data: handleRequestDelData,
};
const handleOpen: RequestHandler<APP_REQUESTS.OPEN> = {
  default: handleRequestOpen,
};
const handleSendToClient: RequestHandler<APP_REQUESTS.SEND> = {
  default: async (app, appData): Promise<void> => {
    serverService.sendToClient({
      app: appData.payload.app || app,
      type: appData.payload.type || "",
      payload: appData.payload.payload ?? "",
      request: appData.payload.request || "",
      clientId: appData.payload.clientId || "",
    });
  },
};
const handleSendToApp: RequestHandler<APP_REQUESTS.TOAPP> = {
  default: async (app, appData): Promise<void> => {
    Logger.info("Sent data ", appData.payload, " to other app");
  },
};

const handleRequestSongGet: RequestHandler<SongEvent.GET> = {
  song: async (app, appData): Promise<void> => {
    Logger.info("Sent data ", appData.payload, " to other app");
  },
  refresh: async (app, appData): Promise<void> => {
    Logger.info("Refreshed data ", appData.payload, " to other app");
  },
};
const handleRequestSongSet: RequestHandler<SongEvent.SET> = {
  [AUDIO_REQUESTS.FAST_FORWARD]: async (app, appData): Promise<void> => {
    Logger.info("Unable to fast forward (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.REWIND]: async (app, appData): Promise<void> => {
    Logger.info("Unable to rewind (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.PLAY]: async (app, appData): Promise<void> => {
    Logger.info("Unable to play (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.PAUSE]: async (app, appData): Promise<void> => {
    Logger.info("Unable to pause (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.STOP]: async (app, appData): Promise<void> => {
    Logger.info("Unable to stop (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.NEXT]: async (app, appData): Promise<void> => {
    Logger.info("Unable to next (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.PREVIOUS]: async (app, appData): Promise<void> => {
    Logger.info("Unable to previous (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.SEEK]: async (app, appData): Promise<void> => {
    Logger.info("Unable to seek (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.LIKE]: async (app, appData): Promise<void> => {
    Logger.info("Unable to like (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.VOLUME]: async (app, appData): Promise<void> => {
    Logger.info("Unable to change volume (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.REPEAT]: async (app, appData): Promise<void> => {
    Logger.info("Unable to change repeat (no audio app in emulator)");
  },
  [AUDIO_REQUESTS.SHUFFLE]: async (app, appData): Promise<void> => {
    Logger.info("Unable to change shuffle (no audio app in emulator)");
  }
};
const handleLog: RequestHandler<APP_REQUESTS.LOG> = {
  [LOGGING_LEVELS.LOG]: handleRequestLog,
  [LOGGING_LEVELS.DEBUG]: handleRequestLog,
  [LOGGING_LEVELS.ERROR]: handleRequestLog,
  [LOGGING_LEVELS.FATAL]: handleRequestLog,
  [LOGGING_LEVELS.WARN]: handleRequestLog,
  [LOGGING_LEVELS.MESSAGE]: handleRequestLog,
  default: handleRequestMissing,
};
const handleKey: RequestHandler<APP_REQUESTS.KEY> = {
  add: handleRequestKeyAdd,
  remove: handleRequestKeyRemove,
  trigger: handleRequestKeyTrigger,
  default: handleRequestMissing,
};
const handleAction: RequestHandler<APP_REQUESTS.ACTION> = {
  add: handleRequestActionAdd,
  remove: handleRequestActionRemove,
  update: handleRequestActionUpdate,
  run: handleRequestActionRun,
  default: handleRequestMissing,
};
const handleDefault: RequestHandler<APP_REQUESTS.DEFAULT> = {
  default: handleRequestMissing,
};

const handleSong: RequestHandler<APP_REQUESTS.SONG> = {
  'default': (data, payload) => new MusicService().setSong(payload.payload),
  'data': (data, payload) => new MusicService().setSong(payload.payload)
}

const handleData: TypeHandler = {
  [APP_REQUESTS.GET]: handleGet,
  [APP_REQUESTS.SET]: handleSet,
  [APP_REQUESTS.DELETE]: handleDelete,
  [APP_REQUESTS.OPEN]: handleOpen,
  [APP_REQUESTS.SEND]: handleSendToClient,
  [APP_REQUESTS.TOAPP]: handleSendToApp,
  [APP_REQUESTS.LOG]: handleLog,
  [APP_REQUESTS.KEY]: handleKey,
  [APP_REQUESTS.ACTION]: handleAction,
  default: handleDefault,
  step: { default: () => {} },
  task: { default: () => {} },
  [APP_REQUESTS.SONG]: handleSong,
};

/**
 * Handles a request for authentication data from an app.
 *
 * @deprecated - This function is deprecated and will be removed in a future version.
 * @param {string} appName - The name of the app requesting authentication data.
 * @param {string[]} scope - The scope of the authentication request (This is also what the user will be prompted with and how it will be saved in the file).
 */
export async function requestUserInput(
  appName: string,
  scope: any
): Promise<void> {
  const scopeData = Object.keys(scope).reduce(
    (acc, key) => ({ ...acc, [key]: "placeholder-value" }),
    {}
  );
  ServerMessageBus.notify("app:data", {
    type: "input",
    payload: { scope: scopeData },
    request: "",
  });
}
