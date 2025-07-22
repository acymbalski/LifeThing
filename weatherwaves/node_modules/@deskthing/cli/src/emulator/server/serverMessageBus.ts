// Split into two distinct classes for clear separation
import WebSocket, { WebSocketServer } from "ws";
import { Logger } from "../services/logger";

export class ServerMessageBus {
  private static subscribers = new Map<string, Function[]>();
  private static ws: WebSocketServer;

  static initialize(port: number = 8080) {

    if (this.ws) {
        this.ws.close()
    }

    this.ws = new WebSocketServer({ port: port });

    this.ws.on("connection", (socket: any) => {
      socket.on("message", (message: any) => {
        const { event, data } = JSON.parse(message.toString());
        this.notify(event, data);
      });
    });
  }

  /**
   * Notifies local listeners
   * @param event 
   * @param data 
   */
  static notify(event: string, data: any) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event)?.forEach((callback) => callback(data));
    }
  }

  static subscribe(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(callback);
    return () => this.unsubscribe(event, callback);
  }

  /**
   * Notifies the websocket
   * @param event 
   * @param data 
   */
  static publish(event: string, data: any) {
    // Send to client via IPC/WebSocket
    this.ws.clients.forEach((client) => {
      if (client?.readyState === WebSocket.OPEN) {
        Logger.debug('Sending data through messageBus', event, data)
        client.send(JSON.stringify({ event, data }));
      } else {
        console.error('Unable to send data because readystate of client is ', client?.readyState)
      }
    });
  }

  private static unsubscribe(event: string, callback: Function) {
    const callbacks = this.subscribers.get(event);
    const index = callbacks?.indexOf(callback);
    if (callbacks && index !== undefined && index > -1) {
      callbacks.splice(index, 1);
    }
  }
}
