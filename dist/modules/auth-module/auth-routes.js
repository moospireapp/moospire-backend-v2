import { Router } from "express";
import { authMiddleware, authController } from "../../modules/auth-module/index.js";
import authValidator from "./auth-validators.js";
const auth = Router();
/**
 * Route for user signup
 * POST /signup
 */
auth
    .route("/signup")
    .post(authMiddleware.isGuestUser, authValidator.signupUser, authController.signupUser);
/**
 * Route for user login
 * POST /login
 */
auth
    .route("/login")
    .post(authMiddleware.isGuestUser, authValidator.loginUser, authController.loginUser);
/**
 * Route for user otp verification
 * POST /verify-otp
 */
auth
    .route("/verify-otp")
    .post(authMiddleware.isAuthUser, authValidator.verifyUserOTP, authController.verifyUserOTP);
/**
 * Route for user otp resend
 * POST /resend-otp
 */
auth
    .route("/resend-otp")
    .post(authMiddleware.isAuthUser, authController.resendUserOTP);
/**
 * Route for requesting password reset
 * POST /request-password
 */
auth
    .route("/request-password")
    .post(authMiddleware.isGuestUser, authValidator.requestUserPassword, authController.requestUserPassword);
/**
 * Route for resetting user password
 * POST /reset-password
 */
auth
    .route("/reset-password")
    .post(authMiddleware.isGuestUser, authValidator.resetUserPassword, authController.resetUserPassword);
/**
 * Route for user logout
 * POST /logout
 */
auth
    .route("/logout")
    .post(authMiddleware.isAuthUser, authController.logoutUser);
export default auth;
//# sourceMappingURL=auth-routes.js.map