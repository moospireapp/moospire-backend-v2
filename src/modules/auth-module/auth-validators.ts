import { Response, NextFunction } from "express";
import {
  SignupUserRequest,
  LoginUserRequest,
  RequestUserPassword,
  ResetUserPasswordRequest,
  VerifyUserOTPRequest,
} from "@/types/user-type.js";
import { validate, sanitize, asyncWrapper } from "@/core/index.js";
import { authService } from "@/modules/auth-module/index.js";

class AuthValidator {
  // Signup User
  signupUser = asyncWrapper(
    async (req: SignupUserRequest, _res: Response, next: NextFunction) => {
      const { firstName, lastName, email, password } = req.body;

      /* VALIDATION SERVICE LAYER */
      validate.body(firstName, "firstname").required().minLength(2);
      validate.body(lastName, "lastname").required().minLength(2);
      validate.body(email, "email").required().email();
      validate.body(password, "password").required().minLength(6).strongPwd();
      validate.validationFailed(next);

      /* SANITIZATION SERVICE LAYER */
      req.body.firstName = sanitize.body(firstName).toTrim().toCase().body_data;
      req.body.lastName = sanitize.body(lastName).toTrim().toCase().body_data;
      req.body.email = sanitize.body(email).toTrim().toCase("lower").body_data;
      req.body.password = await authService.hashPassword(password);
    }
  );

  // Login User
  loginUser = asyncWrapper(
    async (req: LoginUserRequest, _res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      /* VALIDATION SERVICE LAYER */
      validate.body(email, "email").required().email();
      validate.body(password, "password").required().minLength(6);
      validate.validationFailed(next);

      /* SANITIZATION SERVICE LAYER */
      req.body.email = sanitize.body(email).toTrim().toCase("lower").body_data;
    }
  );

  // Request User Password Reset
  requestUserPassword = asyncWrapper(
    async (req: RequestUserPassword, _res: Response, next: NextFunction) => {
      const { email } = req.body;

      /* VALIDATION SERVICE LAYER */
      validate.body(email, "email").required().email();
      validate.validationFailed(next);

      /* SANITIZATION SERVICE LAYER */
      req.body.email = sanitize.body(email).toTrim().toCase("lower").body_data;
    }
  );

  // Reset User Password
  resetUserPassword = asyncWrapper(
    async (
      req: ResetUserPasswordRequest,
      _res: Response,
      next: NextFunction
    ) => {
      const { token, password } = req.body;

      /* VALIDATION SERVICE LAYER */
      validate.body(token, "token").required();
      validate.body(password, "password").required().minLength(6).strongPwd();
      validate.validationFailed(next);

      req.body = { token, password };
    }
  );

  // Verify user OTP
  verifyUserOTP = asyncWrapper(
    async (req: VerifyUserOTPRequest, _res: Response, next: NextFunction) => {
      const { otp } = req.body;
      const { email } = req.payload?.currentUser;

      /* VALIDATION SERVICE LAYER */
      validate.body(otp, "otp").required().minLength(6);
      validate.body(email, "email").required().email();

      req.body.email = email;
      validate.validationFailed(next);
    }
  );
}

// Exporting an instantiated class object
export default new AuthValidator();
