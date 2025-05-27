import { Request, Response } from "express";
import { ApiError } from "../util/ApiError.util";
import { ApiResponse } from "../util/ApiResponse.util";
import { CloudinaryService } from "../service/cloudinary.service";
import { TFileUploadResponseData, TFileUploadSchema } from "../type";
import { EFolder, EMediaType, EStatusCode } from "../constant/application.constant";
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } from "../config/environment.config";

class ChatController {
      private readonly cloudinaryService: CloudinaryService;

      constructor() {
            this.cloudinaryService = new CloudinaryService();
      }

      public handleFileUpload(req: Request<unknown, unknown, TFileUploadSchema>, res: Response): void {
            const { fileName, mediaType, size } = req.body;

            if (size > 1024 * 1024 * 10) throw new ApiError(EStatusCode.PAYLOAD_TOO_LARGE, "File size should be less than 10 MBs.");

            switch (mediaType as EMediaType) {
                  case EMediaType.IMAGE:
                        res.status(EStatusCode.OK).json(
                              new ApiResponse<TFileUploadResponseData>(EStatusCode.OK, "Successfully generated the signed URL.", {
                                    apiKey: CLOUDINARY_API_KEY,
                                    cloudName: CLOUDINARY_CLOUD_NAME,
                                    public_id: fileName,
                                    ...this.cloudinaryService.getSignature(EFolder.IMAGE, fileName)
                              })
                        );

                        break;
                  case EMediaType.VIDEO:
                        break;
                  default:
                        throw new ApiError(EStatusCode.BAD_REQUEST, "Invalid media type.");
            }
      }
}

export { ChatController };

