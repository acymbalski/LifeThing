
import { DEVICE_CLIENT } from "@deskthing/types";
import { ServerMessageBus } from "../server/serverMessageBus";
import { Logger } from "./logger";

export type TimePayload = {
    utcTime: number;
    timezoneOffset: number;
};

export class TimeService {
    private intervalId: NodeJS.Timeout | null = null;

    start() {
        Logger.debug("Starting time service...");
        // Send time update every second
        this.intervalId = setInterval(() => {
            const now = new Date();
            const payload: TimePayload = {
                utcTime: now.getTime(),
                timezoneOffset: now.getTimezoneOffset()
            };

            const TimeDataPayload = { type: DEVICE_CLIENT.TIME, app: 'client', request: 'set', payload: payload }

            
        Logger.debug("Sending Time Update");

            ServerMessageBus.publish("client:request", TimeDataPayload);
        }, 30000); // send every 15s - the server technically updated every 60s
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
