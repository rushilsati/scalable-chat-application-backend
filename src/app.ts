import cors from "cors";
import helmet from "helmet";
import express, { Express } from "express";
import { logger } from "./util/logger.util";
import { ELogLevel } from "./constant/application.constant";
import { createServer, Server as HTTPServer } from "node:http";
import { ACCEPTED_ORIGIN, PORT, SERVER_URL } from "./config/environment.config";
import { Server } from "socket.io";

class App {
      private readonly io: Server;
      private readonly app: Express;
      private readonly server: HTTPServer;

      constructor() {
            this.app = express();
            this.server = createServer(this.app);
            this.io = new Server(this.server, {
                  cors: {
                        origin: ACCEPTED_ORIGIN
                  }
            });
            this.initialize();
      }

      private initialize() {
            this.app.use(
                  cors({
                        credentials: true,
                        origin: ACCEPTED_ORIGIN
                  })
            );
            this.app.use(helmet());
            this.app.use(express.json({ limit: "5MB" }));
      }

      public listen(): void {
            this.server.listen(PORT, () => logger.log(ELogLevel.INFO, `SERVER RUNNING AT ${SERVER_URL}:${PORT}`));
      }
}

export { App };

