import { Request, Response, NextFunction } from "express";
import { asyncWrapper, apiStatus, respondWith } from "@/core";
import { User } from "@/models";

interface ProfileUpdateRequest extends Request {
  payload?: {
    currentUser: any;
  };
}

class ProfileController {
  // Update user profile role
  updateUserRole = asyncWrapper(
    async (
      req: ProfileUpdateRequest,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const { user_data } = req.body;
      const { email } = req.payload?.currentUser;

      const updatedData = await User.findOneAndUpdate(
        { email },
        { userRole: user_data },
        { new: true }
      );

      if (updatedData && typeof updatedData === "object") {
        respondWith(res, apiStatus.success(), {
          message: "Your profile role has been updated",
          data: updatedData.userRole,
        });
      }
    }
  );

  // Handle user profile goals update request
  updateUserGoal = asyncWrapper(
    async (
      req: ProfileUpdateRequest,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const { user_data } = req.body;
      const { email } = req.payload?.currentUser;

      const updatedData = await User.findOneAndUpdate(
        { email },
        { userGoal: user_data },
        { new: true }
      );

      if (updatedData && typeof updatedData === "object") {
        respondWith(res, apiStatus.success(), {
          message: "Your profile goal has been updated",
          data: updatedData.userGoal,
        });
      }
    }
  );

  // Handle user profile preference update request
  updateUserPreference = asyncWrapper(
    async (
      req: ProfileUpdateRequest,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const { user_data } = req.body;
      const { email } = req.payload?.currentUser;

      const updatedData = await User.findOneAndUpdate(
        { email },
        { userPreference: user_data },
        { new: true }
      );

      if (updatedData && typeof updatedData === "object") {
        respondWith(res, apiStatus.success(), {
          message: "Your profile preference has been updated",
          data: updatedData.userPreference,
        });
      }
    }
  );

  // Handle user profile type update request
  updateUserType = asyncWrapper(
    async (
      req: ProfileUpdateRequest,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const { user_type } = req.body;
      const { email } = req.payload?.currentUser;

      const updatedData = await User.findOneAndUpdate(
        { email },
        { userType: user_type },
        { new: true }
      );

      if (updatedData && typeof updatedData === "object") {
        respondWith(res, apiStatus.success(), {
          message: "Your profile type has been updated",
          data: updatedData.userType,
        });
      }
    }
  );
}

export default new ProfileController();
