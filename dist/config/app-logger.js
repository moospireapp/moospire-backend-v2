import path from "path";
import { createLogger, format, transports } from "winston";
import { env } from "../config/index.js";
import { getFileDir } from "../utilities/index.js";
// Create __dirname equivalent for ES modules
const __dirname = getFileDir(import.meta.url);
const { combine, timestamp, printf } = format;
/* A custom format for the logger. */
const customFormat = combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), printf((info) => `[${info.timestamp}] - [${info.level.toUpperCase()}] => ${info.message}`));
/* Creating a transport object with two properties, info and error. */
const transport = {
    info: env.APP_ENV === "development"
        ? new transports.Console({ level: "info" })
        : new transports.File({
            filename: path.join(__dirname, "../logs/app-logs.log"),
            level: "info",
        }),
    error: new transports.File({
        filename: path.join(__dirname, "../logs/app-error-logs.log"),
        level: "error",
    }),
};
const appLogger = createLogger({
    format: customFormat,
    transports: [transport.info, transport.error],
});
export default appLogger;
//# sourceMappingURL=app-logger.js.map