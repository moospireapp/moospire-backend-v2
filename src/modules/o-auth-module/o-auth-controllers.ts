import { Request, Response, NextFunction } from "express";
import {
  asyncWrapper,
  apiStatus,
  respondWith,
  serveCookieResponse,
} from "@/core";
import { oAuthService } from "@/modules/o-auth-module";
import { GoogleProfile, FigmaProfile } from "@/types/o-user-type";
import { UserType } from "@/types/user-type";
import { authService } from "@/modules/auth-module";

class OAuthController {
  // Handles google auth url
  handleGoogleAuthURL = asyncWrapper(
    async (
      _req: Request,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const googleAuthUrl = oAuthService.getGoogleAuthorizationUrl();
      res.redirect(googleAuthUrl);
    }
  );

  // Handles google auth callback
  handleGoogleAuthCallback = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const code = req.query.code as string;
      const tokens = await oAuthService.getGoogleOauthTokens(code);

      if (tokens) {
        const profile = await oAuthService.getGoogleProfile(
          tokens.access_token,
          tokens.id_token
        );

        const authenticatedUser = await oAuthService.authenticateUserProfile(
          profile as GoogleProfile,
          next
        );

        if (!authenticatedUser) return;

        const userIsArchived = await authService.checkUserArchivedState(
          authenticatedUser.user.email,
          next
        );

        if (userIsArchived) return;

        const { user, token } = authenticatedUser as {
          user: UserType;
          token: string;
        };

        serveCookieResponse(res, token);

        respondWith(res, apiStatus.success(), {
          message: "Google profile authenticated successfully",
          data: { user, token },
        });
      } else {
        respondWith(res, apiStatus.internal("Error fetching tokens"));
      }
    }
  );

  // Handles figma auth url
  handleFigmaAuthURL = asyncWrapper(
    async (
      _req: Request,
      res: Response,
      _next: NextFunction
    ): Promise<void> => {
      const figmaAuthUrl = oAuthService.getFigmaAuthorizationUrl();
      res.redirect(figmaAuthUrl);
    }
  );

  // Handles figma auth callback
  handleFigmaAuthCallback = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const code = req.query.code as string;
      const tokens = await oAuthService.getFigmaOauthTokens(code);

      if (tokens) {
        const profile = await oAuthService.getFigmaProfile(tokens.access_token);

        const authenticatedUser = await oAuthService.authenticateUserProfile(
          profile as FigmaProfile,
          next
        );

        if (!authenticatedUser) return;

        const userIsArchived = await authService.checkUserArchivedState(
          authenticatedUser.user.email,
          next
        );

        if (userIsArchived) return;

        const { user, token } = authenticatedUser as {
          user: UserType;
          token: string;
        };

        serveCookieResponse(res, token);

        respondWith(res, apiStatus.success(), {
          message: "Figma profile authenticated successfully",
          data: { user, token },
        });
      } else {
        respondWith(res, apiStatus.internal("Error fetching tokens"));
      }
    }
  );
}

export default new OAuthController();
