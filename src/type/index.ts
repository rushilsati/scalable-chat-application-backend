import { NextFunction, Request, Response } from "express";
import { Logform } from "winston";
import { EMediaType } from "../constant/application.constant";

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

export type TMatchFoundPayload = {
      user1: { id: string; name: string };
      user2: { id: string; name: string };
      commonInterests: Array<string>;
};

export type TIndividualMessagePayload = {
      to: string;
      from: string;
      message: string;
      media: boolean;
      mediaType: EMediaType;
      mediaURL: string;
};

