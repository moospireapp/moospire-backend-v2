import { Response, NextFunction } from "express";
declare class ProfileValidator {
    validateProfileData: (req: import("express").Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    validateProfileType: (req: import("express").Request, res: Response, next: NextFunction) => Promise<false | undefined>;
}
declare const _default: ProfileValidator;
export default _default;
