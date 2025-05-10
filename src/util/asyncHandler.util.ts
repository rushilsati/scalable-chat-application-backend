import { NextFunction, Request, Response } from "express";
import { TAsyncHandler, TRequestHandler } from "../type";

const asyncHandler: TAsyncHandler = (requestHandler: TRequestHandler) => {
      return (req: Request, res: Response, next: NextFunction) => Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export { asyncHandler };

