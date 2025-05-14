import { Server } from "socket.io";

abstract class BaseHandler {
      protected readonly io: Server;

      constructor(io: Server) {
            this.io = io;

            this.initialize();
      }

      protected abstract initialize(): void;
}

export { BaseHandler };

