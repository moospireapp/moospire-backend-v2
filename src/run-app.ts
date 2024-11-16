import { Application } from "express";
import { env, appLogger, mongoConnect, redisConnect } from "@/config";

/**
 * It connects to the database and starts the server
 * @param app - The express app
 */
const runApp = async (app: Application) => {
  try {
    /* Connecting to the database. */
    mongoConnect();
    redisConnect();

    /* Listening to the port and logging the message. */
    app.listen(env.APP_PORT, () =>
      appLogger.info(`Server is running on port ${env.APP_PORT}`)
    );
  } catch (error) {
    appLogger.error(`An error occured while starting the app => ${error}`);
  }
};

export default runApp;
