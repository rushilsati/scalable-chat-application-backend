import { config } from "dotenv-flow";
import { ENodeEnvironment } from "../constant/environment.constant";

config();

const PORT: number = Number(process.env.PORT) || 8000;

const SERVER_URL: string = process.env.SERVER_URL || `http://localhost`;

const NODE_ENV: ENodeEnvironment = Object.values(ENodeEnvironment).includes(process.env.NODE_ENV as ENodeEnvironment)
      ? (process.env.NODE_ENV as ENodeEnvironment)
      : ENodeEnvironment.DEVELOPMENT;

const ACCEPTED_ORIGIN: string = process.env.ACCEPTED_ORIGIN || "*";

const REDIS_DATABASE_URL: string = process.env.REDIS_DATABASE_URL || "";

const REDIS_DATABASE_USERNAME: string = process.env.REDIS_DATABASE_USERNAME || "";

const REDIS_DATABASE_PASSWORD: string = process.env.REDIS_DATABASE_PASSWORD || "";

export { PORT, SERVER_URL, NODE_ENV, ACCEPTED_ORIGIN, REDIS_DATABASE_URL, REDIS_DATABASE_USERNAME, REDIS_DATABASE_PASSWORD };

