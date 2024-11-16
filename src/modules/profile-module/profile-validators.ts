import { Response, NextFunction } from "express";
import {
  UserProfileRequest,
  UserProfileTypeRequest,
} from "@/types/profile-type";
import { validate, asyncWrapper } from "@/core";

class ProfileValidator {
  // Validate user profile data
  validateProfileData = asyncWrapper(
    async (req: UserProfileRequest, _res: Response, next: NextFunction) => {
      const { user_data } = req.body;

      /* VALIDATION SERVICE LAYER */
      validate
        .body(user_data, "user data")
        .required()
        .notEmpty()
        .validationFailed(next);
    }
  );

  // Validate user profile type
  validateProfileType = asyncWrapper(
    async (req: UserProfileTypeRequest, _res: Response, next: NextFunction) => {
      const { user_type } = req.body;

      /* VALIDATION SERVICE LAYER */
      validate
        .body(user_type, "user type")
        .required()
        .isString()
        .validationFailed(next);
    }
  );
}

// Exporting an instantiated class object
export default new ProfileValidator();
