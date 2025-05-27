import { BaseRouter } from "./base.route";
import { ChatRouter } from "./chat.route";

class V1Router extends BaseRouter {
      private readonly chatRouter: ChatRouter;

      constructor() {
            super();

            this.chatRouter = new ChatRouter();

            this.initializeRoutes();
      }

      protected override initializeRoutes() {
            this._router.use("/chat", this.chatRouter.router);
      }
}

export { V1Router };

