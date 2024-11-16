import express, { Application } from "express";
import { runInitialMiddleware, runFinalMiddleware } from "@/middlewares";
import loadAppRoutes from "@/routes";
import runApp from "@/run-app";

const app: Application = express();

/* Loading initial middlewares. */
runInitialMiddleware(app);

/* Loading all the routes of the application. */
loadAppRoutes(app);

/* Loading final middlewares. */
runFinalMiddleware(app);

/* Starting the application. */
runApp(app);
