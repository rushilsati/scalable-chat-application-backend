import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validate = <T extends z.ZodTypeAny>(schema: T) => {
      return (req: Request<unknown, unknown, z.infer<T>>, _res: Response, next: NextFunction) => {
            try {
                  req.body = schema.parse(req.body) as z.infer<T>;
                  next();
            } catch (error: unknown) {
                  next(error);
            }
      };
};

export { validate };

