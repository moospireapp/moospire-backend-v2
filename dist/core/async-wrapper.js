import { apiStatus, respondWith } from "../core/index.js";
/**
 * Wraps an asynchronous function for error handling in Express routes.
 * @param fn - The asynchronous function to be wrapped.
 * @returns A function that handles errors in asynchronous routes.
 */
const asyncWrapper = (fn) => {
    //@ts-ignore
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            console.error("ERROR MESSAGE", error?.message);
            // Handle specific errors (e.g., MongoDB duplicate email or invalid ObjectId)
            if (error?.code === "11000" && error?.keyValue?.email) {
                respondWith(res, apiStatus.badRequest(), {
                    description: "Email already exists",
                });
                return false;
            }
            if (error?.kind === "ObjectId" && error?.path === "userId") {
                respondWith(res, apiStatus.badRequest(), {
                    description: "Incorrect user fetch id",
                });
                return false;
            }
            // Pass the error to the next middleware
            next(error?.message);
        }
    };
};
export default asyncWrapper;
//# sourceMappingURL=async-wrapper.js.map