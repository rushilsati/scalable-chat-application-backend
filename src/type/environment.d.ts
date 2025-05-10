declare global {
      namespace NodeJS {
            interface ProcessEnv {
                  NODE_ENV: string;
                  PORT?: string;
                  SERVER_URL?: string;
                  ACCEPTED_ORIGIN?: string;
                  REDIS_DATABASE_URL?: string;
                  REDIS_DATABASE_USERNAME?: string;
                  REDIS_DATABASE_PASSWORD?: string;
            }
      }
}

export {};

