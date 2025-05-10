import { Router } from "express";

class RouteManager {
      private readonly _router: Router;

      constructor() {
            this._router = Router();
            this.registerRoutes();
      }

      registerRoutes() {}

      get router(): Router {
            return this._router;
      }
}

export { RouteManager };

