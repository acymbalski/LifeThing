import { FSWatcher, watch as fsWatch } from "fs";
import { Logger } from "../services/logger";

import { handleDataFromApp } from "./coms";

import { Worker } from "node:worker_threads";

import { AppManifest, getManifestDetails } from "./manifestDetails";
import { ServerMessageBus } from "./serverMessageBus";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { DeskThingConfig } from "../../config/deskthing.config";
import { LOGGING_LEVELS } from "@deskthing/types";
import { MusicService } from "../services/musicService";

export class ServerRunner {
  private serverWorker: Worker | null = null;
  private watcher: FSWatcher | null = null;
  private manifest: AppManifest | null = null;
  private restartTimeout: NodeJS.Timeout | null = null;
  private musicService = new MusicService();

  async start() {
    Logger.debug("Starting server wrapper...");
    this.startServerProcess();
    this.watchWithFsAPI();
    this.manifest = getManifestDetails();
    this.startServerMessageBus();
  }

  private startServerMessageBus() {
    ServerMessageBus.initialize(DeskThingConfig.development.client.linkPort);
    ServerMessageBus.subscribe("app:data", (payload) => {
      if (this.serverWorker) {
        Logger.debug(`[ServerMessageBus]: Received data from app: ${payload.type}`);
        this.serverWorker.postMessage({ type: "data", payload: payload });
      }
    });
    ServerMessageBus.subscribe("auth:callback", (payload) => {
      if (this.serverWorker) {
        this.serverWorker.postMessage({
          type: "data",
          payload: {
            type: "callback-data",
            payload: payload.code,
          },
        });
      }
    });
  }

  private async startServerProcess() {
    Logger.debug("Starting server process...");
    try {
      const projectRoot = process.cwd();
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const workerPath = resolve(__dirname, "serverProcess.js");
      const serverPath = resolve(projectRoot, "server", "index.ts");
      const rootPath = resolve(projectRoot, "server");

      if (this.serverWorker) {
        this.serverWorker.terminate();
        this.serverWorker = null;
        Logger.info("Waiting for server to exit...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const tsConfigPath = resolve(process.cwd(), "tsconfig.node.json")

      this.serverWorker = new Worker(workerPath, {
        workerData: {
          SERVER_INDEX_PATH: serverPath,
          DESKTHING_ROOT_PATH: rootPath,
          NODE_ENV: "development",
          TSM_NODE_PROJECT: tsConfigPath
        },
        execArgv: ['--loader', 'tsm'],
        env: {
          TSM_NODE_PROJECT: tsConfigPath
        }
      });

      this.serverWorker.stdout?.on("data", (data) => {
        Logger.clientLog(LOGGING_LEVELS.LOG, data.toString());
      });

      this.serverWorker.stderr?.on("data", (data) => {
        Logger.clientLog(LOGGING_LEVELS.ERROR, data.toString());
      });

      this.musicService.start();

      setTimeout(() => {
        if (this.serverWorker?.postMessage) {
          this.serverWorker.postMessage({
            type: "start",
          });
        }
      }, 500);

      process.env.SERVER_INDEX_PATH = serverPath;

      Logger.debug("Resolved processPath:", workerPath);

      this.serverWorker.on(
        "message",
        (message: {
          type: string;
          payload?: any;
          log?: string;
          error?: string;
        }) => {
          switch (message.type) {
            case "server:log":
              Logger.debug("[worker]", message.payload);
              return;
            case "server:data":
            case "data":
              handleDataFromApp(
                this.manifest?.id || "testapp",
                message.payload
              );
              return;
            case "server:error":
              return;
            case "started":
              Logger.debug("[worker]", "started");
              return;
            case "stopped":
              Logger.debug("[worker]", "stopped");
              return;
          }
          if (message.log) {
            Logger.clientLog(LOGGING_LEVELS.LOG, message.log);
          } else if (message.error) {
            Logger.clientLog(LOGGING_LEVELS.ERROR, message.error);
          } else {
            Logger.error("Unknown message type:", message.type);
          }
        }
      );

      this.serverWorker.on("error", (error) => {
        Logger.error("Experienced an error in the server wrapper:", error);
      });

      this.serverWorker.on("exit", (code) => {
        if (code !== 0) {
          Logger.warn(`Server worker exited with code ${code}`);
        }
        Logger.debug(`Server worker exited with code ${code}`);
        this.serverWorker = null;
      });

      Logger.debug("Server worker started");
    } catch (error) {
      Logger.error("Server worker failed to start: ", error);
    }
  }
  private watchWithFsAPI() {
    let isInitialScan = true;
    const projectRoot = process.cwd();
    const serverPath = resolve(projectRoot, "server");

    this.watcher = fsWatch(
      serverPath,
      { recursive: true },
      (eventType, filename) => {
        if (filename?.endsWith(".ts")) {
          if (isInitialScan) return;
          Logger.info(`📝 File ${filename} changed, queuing server restart...`);
          this.queueRestart();
        }
      }
    );

    setTimeout(() => {
      isInitialScan = false;
    }, 1000);
  }

  async stop() {
    this.watcher?.close();
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.serverWorker) {
      this.serverWorker.terminate();
      this.serverWorker = null;
    }
  }

  private async queueRestart() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    Logger.info(`🕛 Queued restart in ${DeskThingConfig.development.server.editCooldownMs || 1000}ms`);
    this.restartTimeout = setTimeout(() => {
      this.restartServer();
      this.restartTimeout = null;
      Logger.info(
        `🕛 Waited ${
          DeskThingConfig.development.server.editCooldownMs || 1000
        }ms. Restarting...`
      );
    }, DeskThingConfig.development.server.editCooldownMs || 1000);
  }

  private async restartServer() {
    this.musicService.stop();
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout)
    }
    Logger.info("🔄 Restarting server...");
    if (this.serverWorker) {
      this.serverWorker.terminate();
      this.serverWorker = null;
    }
    this.startServerProcess();
  }
}
