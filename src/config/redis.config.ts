import { logger } from "../util/logger.util";
import { ELogLevel } from "../constant/application.constant";
import { createClient, RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "redis";
import { REDIS_DATABASE_URL } from "./environment.config";

class Redis {
      private _client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

      constructor() {
            this._client = createClient({
                  url: REDIS_DATABASE_URL
            });
      }

      public async connect(): Promise<void> {
            try {
                  await this._client.connect();
                  logger.log(ELogLevel.INFO, "SUCCESSFULLY CONNECTED TO REDIS DATABASE.");
            } catch (error: unknown) {
                  throw error;
            }
      }

      get client(): RedisClientType<RedisModules, RedisFunctions, RedisScripts> {
            return this._client;
      }
}

const redis = new Redis();

export { redis };

