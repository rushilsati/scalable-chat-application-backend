import cors from "cors";
import helmet from "helmet";
import express, { Express } from "express";
import { logger } from "./util/logger.util";
import { ELogLevel } from "./constant/application.constant";
import { SocketManager } from "./socket/sockerManager.socket";
import { createServer, Server as HTTPServer } from "node:http";
import { ACCEPTED_ORIGIN, PORT, SERVER_URL } from "./config/environment.config";
import { RouteManager } from "./route";

class App {
      private readonly app: Express;
      private readonly server: HTTPServer;
      private readonly routeManager: RouteManager;

      constructor() {
            this.app = express();
            this.server = createServer(this.app);

            new SocketManager(this.server);

            this.routeManager = new RouteManager();

            this.initialize();
      }

      private initialize(): void {
            this.app.use(
                  cors({
                        credentials: true,
                        origin: ACCEPTED_ORIGIN
                  })
            );
            this.app.use(helmet());
            this.app.use(express.json({ limit: "5MB" }));
            this.app.use(this.routeManager.router);
      }

      public listen(): void {
            this.server.listen(PORT, () => logger.log(ELogLevel.INFO, `SERVER RUNNING AT ${SERVER_URL}:${PORT}`));
      }
}

export { App };

