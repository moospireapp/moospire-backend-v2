import { Request, Response, NextFunction } from "express";
declare class AuthMiddleware {
    isGuestUser: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    isAuthUser: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
}
declare const _default: AuthMiddleware;
export default _default;
