import { App } from "./app";
import { redis } from "./config/redis.config";
import { ELogLevel } from "./constant/application.constant";
import { logger } from "./util/logger.util";

redis.connect()
      .then(() => {
            const app: App = new App();
            app.listen();
      })
      .catch((error: unknown) => {
            logger.log(ELogLevel.ERROR, "ERROR OCCURED WHILE STARTING THE APP", { error });
            process.exit(1);
      });

