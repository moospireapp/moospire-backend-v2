import { Request, Response, NextFunction } from "express";
/**
 * Middleware for handling errors in the application.
 *
 * @param err - The error thrown in the application.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction.
 */
declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => boolean;
export default errorHandler;
