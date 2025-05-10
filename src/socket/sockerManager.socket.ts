import { Server, Socket } from "socket.io";
import { logger } from "../util/logger.util";
import { Server as HTTPServer } from "node:http";
import { ELogLevel, ESocketEvent } from "../constant/application.constant";
import { ChatHandler } from "./chatHandler.socket";
import { ACCEPTED_ORIGIN } from "../config/environment.config";

class SocketManager {
      private readonly io: Server;

      constructor(server: HTTPServer) {
            this.io = new Server(server, {
                  cors: {
                        origin: ACCEPTED_ORIGIN
                  }
            });

            this.io.on(ESocketEvent.CONNECTION, this.registerHandler.bind(this));
      }

      private registerHandler(socket: Socket) {
            logger.log(ELogLevel.INFO, `USER CONNECTED : ${socket.id}`);

            new ChatHandler(this.io, socket);
      }
}

export { SocketManager };

