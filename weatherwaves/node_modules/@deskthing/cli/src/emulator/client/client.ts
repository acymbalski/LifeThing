import { createServer } from "http";
import { existsSync, readFileSync, statSync } from "fs";
import { extname, join, normalize } from "path";
import { fileURLToPath } from "url";
import { DeskThingConfig } from "../../config/deskthing.config";
import { Logger } from "../services/logger";
import { CallbackService } from "./callbackService";

export class DevClient {
  async start(): Promise<void> {
    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const staticPath = join(__dirname, "./template");

    Logger.debug(`Static files will be served from: ${staticPath}`);

    const mimeTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".json": "application/json",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "font/otf",
    };

    const server = createServer((req, res) => {
      // Handle only GET requests
      if (req.method !== "GET") {
        res.statusCode = 405;
        res.end("Method Not Allowed");
        return;
      }

      // Get URL path and handle "/" default route
      let urlPath = req.url || "/";
      if (urlPath === "/") {
        urlPath = "/index.html";
      }

      // Handle callback request
      if (urlPath.startsWith("/callback")) {
        CallbackService.handleCallback(req, res);
        return;
      }

      // Handle config request
      if (urlPath === "/config") {
        try {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(DeskThingConfig.development.client));
          return;
        } catch (err) {
          Logger.error("Error serving config:", err);
          res.statusCode = 500;
          res.end("Internal Server Error");
          return;
        }
      }

      // Security: Prevent directory traversal attacks
      const safePath = normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
      const filePath = join(staticPath, safePath);
      Logger.debug(`Serving ${urlPath}`);

      // Check if file exists
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        try {
          // Determine content type based on file extension
          const ext = extname(filePath).toLowerCase();
          const contentType = mimeTypes[ext] || "application/octet-stream";

          const fileContent = readFileSync(filePath);

          res.writeHead(200, { "Content-Type": contentType });
          res.end(fileContent);
        } catch (err) {
          Logger.error(`Error serving ${filePath}:`, err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      } else {
        // Try serving index.html as fallback for SPA routing
        const indexPath = join(staticPath, "index.html");
        if (existsSync(indexPath)) {
          const indexContent = readFileSync(indexPath);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(indexContent);
        } else {
          res.statusCode = 404;
          res.end("Not Found");
        }
      }
    });

    const clientPort = DeskThingConfig.development.client.clientPort;
    server.listen(clientPort, () => {
      Logger.info(
        `\x1b[36m🚀 Development Server is running at http://localhost:${clientPort}\x1b[0m`
      );
      Logger.info(
        `\x1b[33m🔄 Callback Server is running at http://localhost:${clientPort}/callback \x1b[0m`
      );
    });
  }
}
