import mongoose from "mongoose";
import { env, appLogger } from "../config/index.js";
/**
 * Connect to MongoDB using the provided connection string, and log the result
 * @param url - The URL to connect to MongoDB. Defaults to the MONGODB_CONNECTION_STRING environment variable.
 */
const mongoConnect = (url = env.MONGODB_CONNECTION_STRING) => {
    mongoose
        .connect(url)
        .then(() => appLogger.info("Connected to MongoDB"))
        .catch((err) => {
        appLogger.error(`MongoDB connection error => ${err.message}`);
        setTimeout(() => {
            appLogger.error("Restarting Mongo server");
            mongoConnect(); // Retry connection after 2 seconds
        }, 2000);
    });
};
export default mongoConnect;
//# sourceMappingURL=mongo-connect.js.map