import { ENodeEnvironment } from "../constant/environment.constant";

const PORT: number = Number(process.env.PORT) || 8000;

const SERVER_URL: string = process.env.SERVER_URL || `http://localhost`;

const NODE_ENV: ENodeEnvironment = Object.values(ENodeEnvironment).includes(process.env.NODE_ENV as ENodeEnvironment)
      ? (process.env.NODE_ENV as ENodeEnvironment)
      : ENodeEnvironment.DEVELOPMENT;

export { PORT, SERVER_URL, NODE_ENV };

