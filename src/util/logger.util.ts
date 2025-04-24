import "winston-daily-rotate-file";
import { join } from "node:path";
import { inspect } from "node:util";
import { existsSync, mkdirSync } from "node:fs";
import DailyRotateFile from "winston-daily-rotate-file";
import { NODE_ENV } from "../config/environment.config";
import { ICustomTransformableInfo, LogMeta } from "../type";
import { ELogLevel } from "../constant/application.constant";
import { ENodeEnvironment } from "../constant/environment.constant";
import winston, { createLogger, format, Logform, transports } from "winston";

class Logger {
      public readonly logger: winston.Logger;

      constructor() {
            this.logger = createLogger({
                  defaultMeta: {
                        meta: {}
                  },
                  transports: [...this.createCustomConsoleTransport(), ...this.createCustomFileTransport()]
            });
      }

      createCustomFileFormat(): winston.Logform.Format {
            const customFileFormat: winston.Logform.Format = format.printf((info: ICustomTransformableInfo): string => {
                  const { level, timestamp, message, meta = {} } = info;

                  const customLevel = level.toUpperCase();

                  const customMessage: string = message as string;

                  const customMeta: Record<string, unknown> = {};

                  for (const [key, value] of Object.entries(meta)) {
                        if (value instanceof Error) {
                              customMeta[key] = {
                                    name: value.name,
                                    message: value.message,
                                    trace: value.stack || ""
                              };
                        } else customMeta[key] = value;
                  }

                  return JSON.stringify({ level: customLevel, message: customMessage, timestamp, meta: customMeta }, null, 6);
            });

            return customFileFormat;
      }

      createCustomFileTransport(): Array<DailyRotateFile> {
            const customFileFormat: winston.Logform.Format = this.createCustomFileFormat();

            const pathToLogsFolder: string = join(__dirname, "../", "../", "logs");

            if (existsSync(pathToLogsFolder)) mkdirSync(pathToLogsFolder, { recursive: true });

            return [
                  new transports.DailyRotateFile({
                        level: ELogLevel.INFO,
                        filename: join(pathToLogsFolder, `${NODE_ENV}-%DATE%.log`),
                        datePattern: "YYYY-MM-DD-HH",
                        format: customFileFormat,
                        zippedArchive: true,
                        maxSize: "20m",
                        maxFiles: "5d"
                  })
            ];
      }

      createCustomConsoleFormat(): Logform.Format {
            const customLogFormat: Logform.Format = format.printf((info: ICustomTransformableInfo) => {
                  const { level, timestamp, message, meta = {} } = info;

                  const customLevel: string = level.toUpperCase();

                  const customMesasge: string = message as string;

                  const customMeta: string = inspect(meta, {
                        showHidden: false,
                        depth: null
                  });

                  if (customMeta.length <= 2) return `${customLevel} : [ ${timestamp} ${customMesasge} ]\n`;
                  return `${customLevel} : [ ${timestamp} ${customMesasge} ]\n${customMeta}\n`;
            });

            return customLogFormat;
      }

      createCustomConsoleTransport(): Array<transports.ConsoleTransportInstance> {
            if (NODE_ENV !== ENodeEnvironment.PRODUCTION) {
                  const customConsoleFormat: Logform.Format = this.createCustomConsoleFormat();

                  return [
                        new transports.Console({
                              level: ELogLevel.INFO,
                              format: format.combine(format.timestamp(), customConsoleFormat)
                        })
                  ];
            }
            return [];
      }

      public log(level: ELogLevel, message: string, meta?: LogMeta): void {
            this.logger.log({ level, message, meta });
      }
}

const logger: Logger = new Logger();

export { logger };

