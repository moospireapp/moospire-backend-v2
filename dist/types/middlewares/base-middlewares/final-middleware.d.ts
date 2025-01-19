import { Application } from "express";
/**
 * This function loads final middlewares for the application.
 * @param app - The express application instance.
 */
declare const loadFinalMiddlewares: (app: Application) => void;
export default loadFinalMiddlewares;
