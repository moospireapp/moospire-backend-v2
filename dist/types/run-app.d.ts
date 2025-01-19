import { Application } from "express";
/**
 * It connects to the database and starts the server
 * @param app - The express app
 */
declare const runApp: (app: Application) => Promise<void>;
export default runApp;
