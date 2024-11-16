import fs from "fs";
import path from "path";
import morgan from "morgan";
import { env } from "@/config";
import { getFileDir } from "@/utilities";

// Create __dirname equivalent for ES modules
const __dirname = getFileDir(import.meta.url);

/**
 * It returns a middleware function that logs HTTP requests to a file.
 *
 * @param filePath - The path to the file where the logs will be written.
 * @param [allowSkip=false] - If true, the logger will skip logging requests that have a status code of 400 or less.
 * @returns A middleware function for morgan that logs HTTP requests.
 */
const httpLogger = (filePath: string, allowSkip: boolean = false) => {
  const streamOptions = {
    stream: fs.createWriteStream(path.join(__dirname, "../logs", filePath), {
      flags: "a",
    }),
  };

  return morgan(
    // @ts-ignore
    env.MORGAN_OUTPUT_FORMAT,
    {
      skip: allowSkip ? (_, res) => res.statusCode <= 400 : false,
      ...streamOptions,
    }
  );
};

export default httpLogger;
