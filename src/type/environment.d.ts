declare global {
      namespace NodeJS {
            interface ProcessEnv {
                  NODE_ENV: string;
                  PORT?: string;
                  SERVER_URL?: string;
                  ACCEPTED_ORIGIN?: string;
            }
      }
}

export {};

