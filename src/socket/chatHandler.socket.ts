import { Server, Socket } from "socket.io";
import { BaseHandler } from "./baseHandler.socket";
import { ELogLevel, ESocketEvent } from "../constant/application.constant";
import { THandleMatchRequestArgs, TMatchedUser } from "../type";
import { ChatService } from "../service/chat.service";
import { logger } from "../util/logger.util";

class ChatHandler extends BaseHandler {
      private readonly chatService: ChatService;

      constructor(io: Server, socket: Socket) {
            super(io, socket);

            this.chatService = new ChatService();
      }

      protected override setup(): void {
            this.socket.on(ESocketEvent.MATCH_REQUEST, this.handleMatchRequest.bind(this));
      }

      private async handleMatchRequest(data: THandleMatchRequestArgs): Promise<void> {
            logger.log(ELogLevel.INFO, `USER - ${this.socket.id} EMITTED - ${ESocketEvent.MATCH_REQUEST}`, data);

            const { name, interests } = data;

            const matchedUser: TMatchedUser | null = await this.chatService.matchUser(this.socket.id, name, interests);

            if (matchedUser !== null) {
                  const commonInterests: Array<string> = interests.filter((interest: string): boolean => matchedUser.interests.includes(interest));

                  this.socket.emit(ESocketEvent.MATCH_FOUND, { id: matchedUser.id, name: matchedUser.name, commonInterests });
                  this.io.to(matchedUser.id).emit(ESocketEvent.MATCH_FOUND, { id: this.socket.id, name, commonInterests });

                  logger.log(ELogLevel.INFO, `SERVER EMITTED - ${ESocketEvent.MATCH_FOUND} FOR - ${this.socket.id} and ${matchedUser.id}`, {
                        commonInterests
                  });
            }
      }
}

export { ChatHandler };

