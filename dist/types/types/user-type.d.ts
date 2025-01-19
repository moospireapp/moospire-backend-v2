import { Document } from "mongoose";
import { Request } from "express";
export declare enum UserRole {
    SUPERADMIN = "super-admin",
    ADMIN = "admin",
    REGULAR = "regular"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare enum UserType {
    BEGINEER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
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
export interface SignupUserRequest extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
}
export interface LoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}
export interface RequestUserPassword extends Request {
    body: {
        email: string;
    };
}
export interface ResetUserPasswordRequest extends Request {
    body: {
        token: string;
        password: string;
    };
}
export interface VerifyUserOTPRequest extends Request {
    body: {
        otp: string;
        email?: string;
    };
    payload?: {
        currentUser: any;
    };
}
