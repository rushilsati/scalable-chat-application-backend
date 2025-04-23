import { Logform } from "winston";

export interface LogMeta {
      [key: string]: unknown;
}

export interface ICustomTransformableInfo extends Logform.TransformableInfo {
      timestamp?: string;
      meta?: LogMeta;
}

