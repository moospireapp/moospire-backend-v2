import { Request, Response, NextFunction } from "express";
import { ApiResponse, apiStatus, respondWith } from "@/core/index.js";
import { appLogger } from "@/config/index.js";

/**
 * Middleware for handling errors in the application.
 *
 * @param err - The error thrown in the application.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction.
 */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  /* Logging the error to the error logs. */
  appLogger.error(err);

  /* Check if error is an instance of ApiResponse, else return an Internal server error. */
  return err instanceof ApiResponse
    ? respondWith(res, err)
    : respondWith(res, apiStatus.internal(err?.message));
};

export default errorHandler;
