import { BaseRouter } from "./base.route";
import { fileUploadSchema } from "../schema";
import { asyncHandler } from "../util/asyncHandler.util";
import { validate } from "../middleware/validate.middleware";
import { ChatController } from "../controller/chat.controller";

class ChatRouter extends BaseRouter {
      private readonly chatController: ChatController;

      constructor() {
            super();

            this.chatController = new ChatController();

            this.initializeRoutes();
      }

      protected override initializeRoutes() {
            this._router
                  .route("/file-upload")
                  .post(asyncHandler(validate(fileUploadSchema)), asyncHandler(this.chatController.handleFileUpload.bind(this.chatController)));
      }
}

export { ChatRouter };

