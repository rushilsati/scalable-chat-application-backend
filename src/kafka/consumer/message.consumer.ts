import { Consumer, EachMessagePayload } from "kafkajs";
import { KafkaConfig } from "../config/kafka.config";
import { EKafkaTopic, ELogLevel, EMessageType, ESocketEvent } from "../../constant/application.constant";
import { KAFKA_GROUP_ID } from "../../config/environment.config";
import { logger } from "../../util/logger.util";
import { Server } from "socket.io";
import { TIndividualMessagePayload, TMatchFoundPayload } from "../../type";

class MessageConsumer {
      private readonly messageConsumer: Consumer;

      constructor() {
            this.messageConsumer = KafkaConfig.getInstance().consumer({ groupId: KAFKA_GROUP_ID });
      }

      public async subscribe(): Promise<void> {
            try {
                  await this.messageConsumer.subscribe({
                        topic: EKafkaTopic.MESSAGE,
                        fromBeginning: false
                  });

                  logger.log(ELogLevel.INFO, `MESSAGE CONSUMER SUCCESSFULLY SUBSCRIBED TO ${EKafkaTopic.MESSAGE}`);
            } catch (error: unknown) {
                  logger.log(ELogLevel.ERROR, `ERROR - MESSAGE CONSUMER UNABLE TO SUBSCRIBE TO ${EKafkaTopic.MESSAGE}`, { error });
            }
      }

      private consumeIndividualMessage(io: Server, message: TIndividualMessagePayload): void {
            io.to(message.to).emit(ESocketEvent.INDIVIDUAL_MESSAGE, message);
            logger.log(ELogLevel.INFO, `MESSAGE EVENT OF TYPE ${EMessageType.INDIVIDUAL_MESSAGE} RECEIVED`, { message });
      }

      private consumeMatchFoundMessage(io: Server, message: TMatchFoundPayload): void {
            io.to(message.user1.id).emit(ESocketEvent.MATCH_FOUND, {
                  id: message.user2.id,
                  name: message.user2.name,
                  commonInterests: message.commonInterests
            });

            io.to(message.user2.id).emit(ESocketEvent.MATCH_FOUND, {
                  id: message.user1.id,
                  name: message.user1.name,
                  commonInterests: message.commonInterests
            });

            logger.log(ELogLevel.INFO, `MESSAGE EVENT OF TYPE ${EMessageType.MATCH_FOUND_MESSAGE} RECEIVED`, { message });
      }

      private consumeGroupChatMessage(): void {}

      public async run(io: Server): Promise<void> {
            try {
                  await this.messageConsumer.run({
                        eachMessage: async ({ message }: EachMessagePayload): Promise<void> => {
                              await Promise.resolve();

                              const key: string | undefined = message.key?.toString();
                              const value: string | undefined = message.value?.toString();

                              if (!key || !value) return;

                              const data: unknown = JSON.parse(value);

                              switch (key as EMessageType) {
                                    case EMessageType.MATCH_FOUND_MESSAGE:
                                          logger.log(ELogLevel.ERROR, `123`);
                                          return this.consumeMatchFoundMessage(io, data as TMatchFoundPayload);

                                    case EMessageType.INDIVIDUAL_MESSAGE:
                                          return this.consumeIndividualMessage(io, data as TIndividualMessagePayload);

                                    case EMessageType.GROUP_CHAT_MESSAGE:
                                          return this.consumeGroupChatMessage();

                                    default:
                                          return;
                              }
                        }
                  });
            } catch (error: unknown) {
                  logger.log(ELogLevel.ERROR, `ERROR - MESSAGE CONSUMER UNABLE TO SUBSCRIBE TO ${EKafkaTopic.MESSAGE}`, { error });
            }
      }
}

const messageConsumer: MessageConsumer = new MessageConsumer();

export { messageConsumer };

