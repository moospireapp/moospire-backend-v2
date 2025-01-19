import { asyncWrapper, apiStatus } from "../../core/index.js";
import { authService } from "../../modules/auth-module/index.js";
import { redisClient } from "../../config/index.js";
/* Class-based middleware for handling authentication and guest access */
class AuthMiddleware {
    /* Middleware to allow only guest users (unauthenticated users) */
    isGuestUser = asyncWrapper(async (req, _res, next) => {
        const token = req.cookies?.token;
        // If no valid token is found, proceed; otherwise, block access
        if (typeof token === "undefined" || token === "null") {
            next();
        }
        else {
            next(apiStatus.unProcessable("Authenticated users cannot access this route"));
        }
    });
    /* Middleware to ensure the user is authenticated */
    isAuthUser = asyncWrapper(async (req, _res, next) => {
        const token = req.cookies?.token;
        // Check if the authorization token is provided
        if (typeof token === "undefined") {
            return next(apiStatus.unauthorized());
        }
        else {
            const verifiedToken = await authService.verifyToken(token);
            // Handle invalid or expired tokens
            if (typeof verifiedToken === "string") {
                if (["jwt expired", "invalid signature"].includes(verifiedToken)) {
                    return next(apiStatus.forbidden());
                }
            }
            else if (await redisClient.get(`black-list-${token}`)) {
                // Block blacklisted tokens
                return next(apiStatus.unauthorized());
            }
            else if (verifiedToken.exp && verifiedToken.iat) {
                // Set payload only if exp (expiration) and iat (issued at) are valid
                req.payload = {
                    ttl: verifiedToken.exp - verifiedToken.iat,
                    token,
                    currentUser: verifiedToken.current_user,
                };
                return next();
            }
            else {
                // Handle unexpected token structure
                return next(apiStatus.forbidden("Invalid token structure"));
            }
        }
    });
}
export default new AuthMiddleware();
//# sourceMappingURL=auth-middlewares.js.map