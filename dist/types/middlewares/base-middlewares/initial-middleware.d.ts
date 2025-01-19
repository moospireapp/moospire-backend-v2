import { Application } from "express";
/**
 * This function loads the initial middleware for the application.
 * @param app - The express app.
 * @param express - The express instance.
 */
declare const runInitialMiddleware: (app: Application) => void;
export default runInitialMiddleware;
