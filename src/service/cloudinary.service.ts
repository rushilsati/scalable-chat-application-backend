import { v2 as cloudinary } from "cloudinary";
import { TCloudinaryGetSignatureReturn } from "../type";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../config/environment.config";

class CloudinaryService {
      constructor() {
            cloudinary.config({
                  cloud_name: CLOUDINARY_CLOUD_NAME,
                  api_key: CLOUDINARY_API_KEY,
                  api_secret: CLOUDINARY_API_SECRET
            });
      }

      public getSignature(folderName: string, fileName: string): TCloudinaryGetSignatureReturn {
            const timestamp: number = new Date().getTime();

            const signature = cloudinary.utils.api_sign_request(
                  {
                        timestamp,
                        folder: folderName,
                        public_id: fileName
                  },
                  CLOUDINARY_API_SECRET
            );

            return { timestamp, signature };
      }
}

export { CloudinaryService };

