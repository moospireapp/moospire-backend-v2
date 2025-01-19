import { asyncWrapper, apiStatus, respondWith, serveCookieResponse, } from "../../core/index.js";
import { oAuthService } from "../../modules/o-auth-module/index.js";
import { authService } from "../../modules/auth-module/index.js";
class OAuthController {
    // Handles google auth url
    handleGoogleAuthURL = asyncWrapper(async (_req, res, _next) => {
        const googleAuthUrl = oAuthService.getGoogleAuthorizationUrl();
        res.redirect(googleAuthUrl);
    });
    // Handles google auth callback
    handleGoogleAuthCallback = asyncWrapper(async (req, res, next) => {
        const code = req.query.code;
        const tokens = await oAuthService.getGoogleOauthTokens(code);
        if (tokens) {
            const profile = await oAuthService.getGoogleProfile(tokens.access_token, tokens.id_token);
            const authenticatedUser = await oAuthService.authenticateUserProfile(profile, next);
            if (!authenticatedUser)
                return;
            const userIsArchived = await authService.checkUserArchivedState(authenticatedUser.user.email, next);
            if (userIsArchived)
                return;
            const { user, token } = authenticatedUser;
            serveCookieResponse(res, token);
            respondWith(res, apiStatus.success(), {
                message: "Google profile authenticated successfully",
                data: { user, token },
            });
        }
        else {
            respondWith(res, apiStatus.internal("Error fetching tokens"));
        }
    });
    // Handles figma auth url
    handleFigmaAuthURL = asyncWrapper(async (_req, res, _next) => {
        const figmaAuthUrl = oAuthService.getFigmaAuthorizationUrl();
        res.redirect(figmaAuthUrl);
    });
    // Handles figma auth callback
    handleFigmaAuthCallback = asyncWrapper(async (req, res, next) => {
        const code = req.query.code;
        const tokens = await oAuthService.getFigmaOauthTokens(code);
        if (tokens) {
            const profile = await oAuthService.getFigmaProfile(tokens.access_token);
            const authenticatedUser = await oAuthService.authenticateUserProfile(profile, next);
            if (!authenticatedUser)
                return;
            const userIsArchived = await authService.checkUserArchivedState(authenticatedUser.user.email, next);
            if (userIsArchived)
                return;
            const { user, token } = authenticatedUser;
            serveCookieResponse(res, token);
            respondWith(res, apiStatus.success(), {
                message: "Figma profile authenticated successfully",
                data: { user, token },
            });
        }
        else {
            respondWith(res, apiStatus.internal("Error fetching tokens"));
        }
    });
}
export default new OAuthController();
//# sourceMappingURL=o-auth-controllers.js.map