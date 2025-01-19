import { Request, Response, NextFunction } from "express";
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
declare const notFoundHandler: (req: Request, _req: Response, next: NextFunction, routes: Route[]) => void;
export default notFoundHandler;
