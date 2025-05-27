import { Router } from "express";

abstract class BaseRouter {
      protected readonly _router: Router;

      constructor() {
            this._router = Router();
      }

      protected abstract initializeRoutes(): void;

      get router(): Router {
            return this._router;
      }
}

export { BaseRouter };

