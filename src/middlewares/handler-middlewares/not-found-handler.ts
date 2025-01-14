import { Request, Response, NextFunction } from "express";
import { apiStatus } from "@/core/index.js";

interface Route {
  path: string;
}

/**
 * Middleware for handling 404 and 405 errors.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @param next - Express NextFunction.
 * @param routes - Array of route objects with `path` property.
 */
const notFoundHandler = (
  req: Request,
  _req: Response,
  next: NextFunction,
  routes: Route[]
) => {
  /* Checking if the path exists in the routes array. */
  const pathExists = routes.find((route) => route.path === req.url);

  /* If path exists, return 405 error, else return 404 error. */
  pathExists !== undefined
    ? next(apiStatus.noMethod())
    : next(apiStatus.notFound());
};

export default notFoundHandler;
