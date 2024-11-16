import { Router } from "express";
import { authMiddleware } from "@/modules/auth-module";
import profileValidator from "./profile-validators";
import profileControllers from "./profile-controllers";

const profile = Router();

/**
 * Route for user role update
 * POST /profile/user-role
 */
profile
  .route("/user-role")
  .put(
    authMiddleware.isAuthUser,
    profileValidator.validateProfileData,
    profileControllers.updateUserRole
  );

/**
 * Route for user goals update
 * POST /profile/user-goals
 */
profile
  .route("/user-goal")
  .put(
    authMiddleware.isAuthUser,
    profileValidator.validateProfileData,
    profileControllers.updateUserGoal
  );

/**
 * Route for user preferences update
 * POST /profile/user-preferences
 */
profile
  .route("/user-preference")
  .put(
    authMiddleware.isAuthUser,
    profileValidator.validateProfileData,
    profileControllers.updateUserPreference
  );

/**
 * Route for user type update
 * POST /profile/user-type
 */
profile
  .route("/user-type")
  .put(
    authMiddleware.isAuthUser,
    profileValidator.validateProfileType,
    profileControllers.updateUserType
  );

export default profile;
