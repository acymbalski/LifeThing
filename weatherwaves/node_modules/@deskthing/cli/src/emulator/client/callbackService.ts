import { ServerMessageBus } from "../server/serverMessageBus";
import { Logger } from "../services/logger";

export class CallbackService {
  static handleCallback(req: any, res: any): void {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      Logger.debug("Handling callback with URL: ", url);
      const code = url.searchParams.get("code");
      const appName = url.pathname.split("/callback/")[1];

      if (!code || !appName) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Missing code or app name parameter" })
        );
        return;
      }

      // Send the code to the server message bus
      ServerMessageBus.notify("auth:callback", {
        code,
        appName,
      });

      // Send success response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      Logger.error("Error handling callback:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
}
