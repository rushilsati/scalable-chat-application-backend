import { Router } from "express";
import { V1Router } from "./v1.route";

class RouteManager {
      private readonly _router: Router;
      private v1Router: V1Router | undefined;

      constructor() {
            this._router = Router();
            this.registerRoutes();
      }

      registerRoutes() {
            this.v1Router = new V1Router();

            this._router.use("/api/v1", this.v1Router.router);
      }

      get router(): Router {
            return this._router;
      }
}

export { RouteManager };

