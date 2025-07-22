import { DeskThingConfig } from "../../config/deskthing.config";
import { Logger } from "./logger";
import { ServerMessageBus } from "../server/serverMessageBus";
import { DESKTHING_DEVICE, SongData } from "@deskthing/types";

export class MusicService {
  private refreshInterval: NodeJS.Timeout | null = null;

  private currentSong: SongData | null = null;

  start() {
    this.stop();

    const interval = DeskThingConfig.development.server.refreshInterval * 1000;

    if (interval <= 0) {
      Logger.debug("Music service refresh disabled (interval <= 0)");
      return;
    }

    Logger.debug(`Starting music service with ${interval}ms refresh interval`);

    this.refreshInterval = setInterval(() => {
      Logger.debug(`Refreshing music data...`);
      ServerMessageBus.notify("app:data", {
        type: "get",
        request: "refresh",
      });
    }, interval);
  }

  sendSong() {
    ServerMessageBus.publish('client:request', {
      type: DESKTHING_DEVICE.MUSIC,
      payload: this.currentSong,
      app: 'client'
    })
  }

  setSong(song: SongData) {
    this.currentSong = song;
    this.sendSong();
  }

  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      Logger.debug("Music service stopped");
    }
  }
}
