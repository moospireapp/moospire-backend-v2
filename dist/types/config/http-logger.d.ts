/**
 * It returns a middleware function that logs HTTP requests to a file.
 *
 * @param filePath - The path to the file where the logs will be written.
 * @param [allowSkip=false] - If true, the logger will skip logging requests that have a status code of 400 or less.
 * @returns A middleware function for morgan that logs HTTP requests.
 */
declare const httpLogger: (filePath: string, allowSkip?: boolean) => (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
export default httpLogger;
