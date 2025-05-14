import { Server, Socket } from "socket.io";
import { logger } from "../util/logger.util";
import { BaseHandler } from "./baseHandler.socket";
import { ChatService } from "../service/chat.service";
import { THandleMatchRequestArgs, TMatchedUser, TIndividualMessagePayload } from "../type";
import { ELogLevel, ESocketEvent } from "../constant/application.constant";
import { messageProducer } from "../kafka/producer/message.producer";
import { messageConsumer } from "../kafka/consumer/message.consumer";

class ChatHandler extends BaseHandler {
      private readonly chatService: ChatService;

      constructor(io: Server) {
            super(io);

            this.chatService = new ChatService();
      }

      protected override async initialize(): Promise<void> {
            //Kafka initilization
            await this.initializeMessageConsumer();
            await this.initializeMessageProducer();
      }

      public listen(socket: Socket): void {
            socket.on(ESocketEvent.MATCH_REQUEST, (data: THandleMatchRequestArgs): Promise<void> => this.handleMatchRequest(socket, data));
            socket.on(ESocketEvent.INDIVIDUAL_MESSAGE, this.handleIndividualMessage.bind(this));
      }

      private async handleMatchRequest(socket: Socket, data: THandleMatchRequestArgs): Promise<void> {
            logger.log(ELogLevel.INFO, `USER - ${socket.id} EMITTED - ${ESocketEvent.MATCH_REQUEST}`, data);

            const { name, interests } = data;

            const matchedUser: TMatchedUser | null = await this.chatService.matchUser(socket.id, name, interests);
            if (matchedUser !== null) {
                  const commonInterests: Array<string> = interests.filter((interest: string): boolean => matchedUser.interests.includes(interest));

                  await messageProducer.publishMatchFound({
                        user1: { id: socket.id, name: name },
                        user2: { id: matchedUser.id, name: matchedUser.name },
                        commonInterests
                  });

                  logger.log(ELogLevel.INFO, `SERVER EMITTED - ${ESocketEvent.MATCH_FOUND} FOR - ${socket.id} and ${matchedUser.id}`, {
                        commonInterests
                  });
            }
      }

      private async handleIndividualMessage(data: TIndividualMessagePayload): Promise<void> {
            await messageProducer.publishIndividualMessage(data);
      }

      private async initializeMessageConsumer(): Promise<void> {
            await messageConsumer.subscribe();
            await messageConsumer.run(this.io);
      }

      private async initializeMessageProducer(): Promise<void> {
            await messageProducer.connect();
      }
}

export { ChatHandler };

