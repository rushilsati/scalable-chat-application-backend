import { EStatusCode } from "../constant/application.constant";

class ApiResponse<T> {
      public readonly success: boolean;
      public readonly statusCode: EStatusCode;
      public readonly message: string;
      public readonly data: T | null;

      constructor(statusCode: EStatusCode, message: string = "Successfull.", data?: T) {
            this.success = true;
            this.statusCode = statusCode;
            this.message = message;
            this.data = data || null;
      }
}

export { ApiResponse };

