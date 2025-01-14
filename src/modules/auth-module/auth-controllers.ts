import { Request, Response, NextFunction } from "express";
import {
  asyncWrapper,
  apiStatus,
  respondWith,
  serveCookieResponse,
  emailHandler,
} from "@/core/index.js";
import { env, redisClient } from "@/config/index.js";
import { UserRole, UserType } from "@/types/user-type.js";
import { User } from "@/models/index.js";
import { authService } from "@/modules/auth-module/index.js";

interface AuthRequest extends Request {
  payload?: {
    ttl: number;
    token: string;
  };
}

interface VerifyOTPRequest extends Request {
  payload?: {
    otp: string;
    email: string;
  };
}

interface ResendOTPRequest extends Request {
  payload?: {
    currentUser: any;
  };
}

class AuthController {
  // Handles user signup
  signupUser = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Check if user email already exist
      if (await authService.checkEmailExist(req.body.email)) {
        next(apiStatus.conflict(`${req.body.email} already exists!`));
        return;
      }

      // Create user account payload
      const userPayload = await User.create({
        ...req.body,
        experienceLevel:
          req.body.email === env.SUPER_ADMIN_EMAIL
            ? UserRole.SUPERADMIN
            : UserRole.REGULAR,
      });

      // Prepare welcome mail options
      const userOTP = await authService.generateUserOTP(userPayload.email);

      const mailOptions = {
        to: req.body.email,
        subject: "Welcome to Moospire",
      };
      const templateOptions = {
        fullName: `${userPayload.firstName} ${userPayload.lastName}`,
        otp: userOTP,
      };

      // Send out user welcome mail
      emailHandler.sendEmail(mailOptions, "welcome", templateOptions, next);

      // Generate an authenticated signed used payload
      const { user, token } = (await authService.generateUserPayload(
        userPayload
      )) as { user: UserType; token: string };

      serveCookieResponse(res, token);

      respondWith(res, apiStatus.created(), {
        message: "User created successfully",
        data: { user, token },
      });
    }
  );

  // Handles user login
  loginUser = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const response_payload = await authService.validateUserSignIn(
        req.body.email,
        req.body.password,
        next
      );

      if (!response_payload) return;

      // Check if user data has been archived
      const userIsArchived = await authService.checkUserArchivedState(
        req.body.email,
        next
      );

      if (userIsArchived) return;

      const { user, token } = response_payload as {
        user: UserType;
        token: string;
      };

      serveCookieResponse(res, token);

      respondWith(res, apiStatus.success(), {
        message: "User login was successful",
        data: { user, token },
      });
    }
  );

  // Handles password reset requests
  requestUserPassword = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userPayload = await authService.checkEmailExist(
        req.body.email,
        false
      );

      if (
        userPayload &&
        typeof userPayload !== "boolean" &&
        typeof userPayload !== "string"
      ) {
        const { firstName, lastName, email } = userPayload;
        const signed = await authService.signToken({ email }, "5m");

        const mailOptions = { to: email, subject: "Password Reset" };
        const templateOptions = {
          fullName: `${firstName} ${lastName}`,
          resetLink: `${env.DOMAIN_URL}/reset-password/${signed}`,
        };

        emailHandler.sendEmail(
          mailOptions,
          "request-password",
          templateOptions,
          next
        );

        respondWith(res, apiStatus.success(), {
          message: "Password reset link sent to email",
        });
      } else {
        respondWith(res, apiStatus.notFound(), {
          message: `The email ${req.body.email} does not exist in our records`,
        });
      }
    }
  );

  // Handles password reset
  resetUserPassword = asyncWrapper(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const verifiedPayload = await authService.verifyToken(req.body.token);

      if (typeof verifiedPayload !== "string" && verifiedPayload.email) {
        const userPayload = await User.findOne({
          email: verifiedPayload.email,
        });

        if (userPayload) {
          userPayload.password = await authService.hashPassword(
            req.body.password
          );
          await userPayload.save();

          respondWith(res, apiStatus.success(), {
            message: "Password has been updated successfully",
          });
        } else {
          respondWith(res, apiStatus.notFound(), {
            message: "User was not found",
          });
        }
      } else {
        respondWith(
          res,
          apiStatus.unauthorized("Reset token is either invalid or expired")
        );
      }
    }
  );

  // Verifies user OTP for account verification
  verifyUserOTP = asyncWrapper(
    async (
      req: VerifyOTPRequest,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const { otp, email } = req.body;

      const isOTPExist = await redisClient.get(`otp-${email}`);

      if (isOTPExist && otp === isOTPExist) {
        await User.findOneAndUpdate(
          { email },
          { isVerified: true },
          { new: true }
        );

        respondWith(res, apiStatus.success(), {
          message: "Your account has been successfully verified",
        });
      } else {
        respondWith(res, apiStatus.notFound(), {
          message: "Invalid or expired OTP token",
        });
      }
    }
  );

  // Resends OTP for user account verification
  resendUserOTP = asyncWrapper(
    async (
      req: ResendOTPRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { email, firstName, lastName } = req.payload?.currentUser;

      const userOTP = await authService.generateUserOTP(email);
      const mailOptions = { to: email, subject: "Account verification OTP" };
      const templateOptions = {
        fullName: `${firstName} ${lastName}`,
        otp: userOTP,
      };

      emailHandler.sendEmail(mailOptions, "otp-resend", templateOptions, next);

      respondWith(res, apiStatus.success(), {
        message: "OTP email re-sent successfully",
      });
    }
  );

  // Handles user logout
  logoutUser = asyncWrapper(
    async (
      req: AuthRequest,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const { ttl, token } = req.payload!;

      await redisClient.setEx(`black-list-${token}`, ttl, "true");

      // EXPIRE THE COOKIE TOKEN
      serveCookieResponse(res, "", true);

      respondWith(res, apiStatus.success(), {
        message: "User logout was successful",
      });
    }
  );
}

export default new AuthController();
