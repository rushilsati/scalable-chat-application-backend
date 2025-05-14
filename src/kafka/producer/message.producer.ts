import { Producer } from "kafkajs";
import { EKafkaTopic, ELogLevel, EMessageType } from "../../constant/application.constant";
import { logger } from "../../util/logger.util";
import { KafkaConfig } from "../config/kafka.config";
import { TIndividualMessagePayload, TMatchFoundPayload } from "../../type";

class MessageProducer {
      private readonly producer: Producer;

      constructor() {
            this.producer = KafkaConfig.getInstance().producer();
      }

      public async connect(): Promise<void> {
            try {
                  await this.producer.connect();
                  logger.log(ELogLevel.INFO, `MESSAGE PRODUCER SUCCESSFULLY CONNECTED TO KAFKA`);
            } catch (error: unknown) {
                  logger.log(ELogLevel.ERROR, `ERROR - MESSAGE PRODUCER IS UNABLE TO CONNECTED TO KAFKA`, { error });
            }
      }

      public async publishMatchFound(message: TMatchFoundPayload): Promise<void> {
            try {
                  await this.producer.send({
                        topic: EKafkaTopic.MESSAGE,
                        messages: [
                              {
                                    key: EMessageType.MATCH_FOUND_MESSAGE,
                                    value: JSON.stringify(message)
                              }
                        ]
                  });

                  logger.log(ELogLevel.INFO, `MATCH FOUND EVENT SUCCESSFULLY EMITTED TO - ${EKafkaTopic.MESSAGE}`, { message });
            } catch (error: unknown) {
                  logger.log(ELogLevel.ERROR, `ERROR - MESSAGE PRODUCER UNABLE TO SEND EVENT TO TOPIC ${EKafkaTopic.MESSAGE}`, {
                        message,
                        error
                  });
            }
      }

      public async publishIndividualMessage(message: TIndividualMessagePayload): Promise<void> {
            try {
                  await this.producer.send({
                        topic: EKafkaTopic.MESSAGE,
                        messages: [
                              {
                                    key: EMessageType.INDIVIDUAL_MESSAGE,
                                    value: JSON.stringify(message)
                              }
                        ]
                  });

                  logger.log(ELogLevel.INFO, `MATCH FOUND EVENT SUCCESSFULLY EMITTED TO - ${EKafkaTopic.MESSAGE}`, { message });
            } catch (error: unknown) {
                  logger.log(ELogLevel.ERROR, `ERROR - MESSAGE PRODUCER UNABLE TO SEND EVENT TO TOPIC ${EKafkaTopic.MESSAGE}`, {
                        message,
                        error
                  });
            }
      }
}

const messageProducer: MessageProducer = new MessageProducer();

export { messageProducer };

