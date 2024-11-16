import { Router } from "express";
import { authMiddleware } from "@/modules/auth-module";
import { oAuthController } from "@/modules/o-auth-module";

const oauth = Router();

/**
 * Route for google oauth
 * GET /google
 */
oauth
  .route("/google")
  .get(authMiddleware.isGuestUser, oAuthController.handleGoogleAuthURL);

/**
 * Route for google oauth callback
 * GET /google/callback
 */
oauth
  .route("/google/callback")
  .get(authMiddleware.isGuestUser, oAuthController.handleGoogleAuthCallback);

/**
 * Route for figma oauth
 * GET /figma
 */
oauth
  .route("/figma")
  .get(authMiddleware.isGuestUser, oAuthController.handleFigmaAuthURL);

/**
 * Route for figma oauth callback
 * GET /figma/callback
 */
oauth
  .route("/figma/callback")
  .get(authMiddleware.isGuestUser, oAuthController.handleFigmaAuthCallback);

export default oauth;
