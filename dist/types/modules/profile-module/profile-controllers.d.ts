import { Request, Response, NextFunction } from "express";
declare class ProfileController {
    updateUserRole: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    updateUserGoal: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    updateUserPreference: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    updateUserType: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
}
declare const _default: ProfileController;
export default _default;
