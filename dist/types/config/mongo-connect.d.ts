/**
 * Connect to MongoDB using the provided connection string, and log the result
 * @param url - The URL to connect to MongoDB. Defaults to the MONGODB_CONNECTION_STRING environment variable.
 */
declare const mongoConnect: (url?: string) => void;
export default mongoConnect;
