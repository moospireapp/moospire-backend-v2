import { apiStatus, respondWith } from "../core/index.js";
import { Router } from "express";
const baseRoute = Router();
/**
 * Route for API health check
 * GET /health
 */
baseRoute.route("/health").get((_req, res) => {
    respondWith(res, apiStatus.success(), {
        message: "API is in a good state today, Hurray!!!",
    });
});
export default baseRoute;
//# sourceMappingURL=base-routes.js.map