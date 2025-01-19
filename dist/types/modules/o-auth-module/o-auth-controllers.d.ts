import { Request, Response, NextFunction } from "express";
declare class OAuthController {
    handleGoogleAuthURL: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    handleGoogleAuthCallback: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    handleFigmaAuthURL: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
    handleFigmaAuthCallback: (req: Request, res: Response, next: NextFunction) => Promise<false | undefined>;
}
declare const _default: OAuthController;
export default _default;
