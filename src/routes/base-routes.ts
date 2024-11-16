import { apiStatus, respondWith } from "@/core";
import { Request, Response, Router } from "express";

const baseRoute = Router();

/**
 * Route for API health check
 * GET /health
 */
baseRoute.route("/health").get((_req: Request, res: Response) => {
  respondWith(res, apiStatus.success(), {
    message: "API is in a good state today, Hurray!!!",
  });
});

export default baseRoute;
