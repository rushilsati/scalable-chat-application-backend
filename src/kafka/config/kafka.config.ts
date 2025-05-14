import { Kafka, logLevel } from "kafkajs";
import { KAFKA_BROKERS, KAFKA_CLIENT_ID } from "../../config/environment.config";

class KafkaConfig {
      private static instance: Kafka;

      static getInstance(): Kafka {
            KafkaConfig.instance = new Kafka({
                  clientId: KAFKA_CLIENT_ID,
                  brokers: KAFKA_BROKERS,
                  logLevel: logLevel.ERROR
            });

            return KafkaConfig.instance;
      }
}

export { KafkaConfig };

