import listEndpoints from "express-list-endpoints";
import { notFoundHandler, errorHandler } from "@/middlewares";
import { Application, Request, Response, NextFunction } from "express";

/**
 * This function loads final middlewares for the application.
 * @param app - The express application instance.
 */
const loadFinalMiddlewares = (app: Application): void => {
  /* A middleware that will catch any request that is not handled by any other middleware. */
  app.all("*", (req: Request, res: Response, next: NextFunction) =>
    notFoundHandler(req, res, next, listEndpoints(app))
  );

  /* A middleware that will catch any error that is thrown in the application. */
  app.use(errorHandler);
};

export default loadFinalMiddlewares;
