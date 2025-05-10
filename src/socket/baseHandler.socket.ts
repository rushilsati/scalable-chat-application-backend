import { Server, Socket } from "socket.io";

abstract class BaseHandler {
      protected readonly io: Server;
      protected readonly socket: Socket;

      constructor(io: Server, socket: Socket) {
            this.io = io;
            this.socket = socket;
            this.setup();
      }

      protected abstract setup(): void;
}

export { BaseHandler };

