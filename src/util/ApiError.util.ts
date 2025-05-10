import { EStatusCode } from "../constant/application.constant";

class ApiError extends Error {
      public readonly success: boolean;
      public readonly statusCode: EStatusCode;
      public override readonly message: string;
      public readonly data: null;
      public readonly error: unknown;
      public override readonly stack?: string;

      constructor(statusCode: EStatusCode, message: string = "Something went wrong.", error: unknown = undefined, stack: string = "") {
            super(message);

            this.success = false;
            this.statusCode = statusCode;
            this.message = message;
            this.data = null;
            this.error = error;

            if (stack) this.stack = stack;
            else Error.captureStackTrace(this, this.constructor);

            Object.setPrototypeOf(this, ApiError.prototype);
      }
}

export { ApiError };

