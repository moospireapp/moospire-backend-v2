import { Document } from "mongoose";
import { Request } from "express";

export enum UserRole {
  SUPERADMIN = "super-admin",
  ADMIN = "admin",
  REGULAR = "regular",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum UserType {
  BEGINEER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  about: string;
  phone: string;
  image?: {
    id: string;
    url: string;
  };
  experienceLevel: UserRole;
  userRole: string[];
  userGoal: string[];
  userPreference: string[];
  userType: UserType;
  isVerified: boolean;
  isArchived: boolean;
  updatedAt?: Date;
  createdAt: Date;
}

/* Define the user signup payload interface */
export interface SignupUserRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

/* Define the user login payload interface */
export interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

/* Define the user request password reset interface */
export interface RequestUserPassword extends Request {
  body: {
    email: string;
  };
}

/* Define the user reset password payload interface */
export interface ResetUserPasswordRequest extends Request {
  body: {
    token: string;
    password: string;
  };
}

/* Define the user verify otp payload interface */
export interface VerifyUserOTPRequest extends Request {
  body: {
    otp: string;
    email?: string;
  };
  payload?: {
    currentUser: any;
  };
}
