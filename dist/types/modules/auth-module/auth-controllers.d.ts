import { Request, Response, NextFunction } from "express";
declare class AuthController {
    signupUser: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    loginUser: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    requestUserPassword: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    resetUserPassword: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    verifyUserOTP: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    resendUserOTP: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    logoutUser: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
}
declare const _default: AuthController;
export default _default;
