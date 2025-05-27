import { z } from "zod";

const fileUploadSchema = z.object({
      fileName: z.string().nonempty({ message: "File name is required." }).trim(),
      mediaType: z.enum(["video", "image", "null"], { message: "Invalid media type." }),
      size: z.number({ required_error: "Filesize is required" })
});

export { fileUploadSchema };

