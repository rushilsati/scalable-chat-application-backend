import { NextFunction, Request, Response } from "express";
import { Logform } from "winston";

export interface LogMeta {
      [key: string]: unknown;
}

export interface ICustomTransformableInfo extends Logform.TransformableInfo {
      timestamp?: string;
      meta?: LogMeta;
}

export type TRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export type TAsyncHandler = (requestHandler: TRequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type TMatchedUser = {
      id: string;
      name: string;
      interests: Array<string>;
};

export type THandleMatchRequestArgs = {
      name: string;
      interests: Array<string>;
};

