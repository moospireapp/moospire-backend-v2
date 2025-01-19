import { Response, NextFunction } from "express";
declare class AuthValidator {
    signupUser: (req: import("express").Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    loginUser: (req: import("express").Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    requestUserPassword: (req: import("express").Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    resetUserPassword: (req: import("express").Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    verifyUserOTP: (req: import("express").Request, res: Response, next: NextFunction) => Promise<false | undefined>;
}
declare const _default: AuthValidator;
export default _default;
