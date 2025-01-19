import { Request, Response, NextFunction } from "express";
/**
 * Wraps an asynchronous function for error handling in Express routes.
 * @param fn - The asynchronous function to be wrapped.
 * @returns A function that handles errors in asynchronous routes.
 */
declare const asyncWrapper: (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
export default asyncWrapper;
