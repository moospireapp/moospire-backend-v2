import { NextFunction } from "express";
import { GoogleTokensResult, FigmaTokensResult, GoogleProfile, FigmaProfile } from "../../../types/o-user-type";
declare class OAuthService {
    private GOOGLE_OAUTH_TOKEN_URL;
    private GOOGLE_PROFILE_URL;
    private FIGMA_OAUTH_TOKEN_URL;
    private FIGMA_PROFILE_URL;
    private googleOauthClient;
    constructor();
    /**
     * Generates the Google OAuth2 authorization URL.
     */
    getGoogleAuthorizationUrl(): string;
    /**
     * Retrieves OAuth tokens from Google using the provided authorization code.
     * @param code Authorization code from Google
     */
    getGoogleOauthTokens(code: string): Promise<GoogleTokensResult | null>;
    /**
     * Retrieves the user's Google profile using access and ID tokens.
     * @param accessToken OAuth access token
     * @param idToken ID token for authentication
     */
    getGoogleProfile(accessToken: string, idToken: string): Promise<GoogleProfile | null>;
    /**
     * Generates the Figma OAuth authorization URL.
     */
    getFigmaAuthorizationUrl(): string;
    /**
     * Retrieves OAuth tokens from Figma using the provided authorization code.
     * @param code Authorization code from Figma
     */
    getFigmaOauthTokens(code: string): Promise<FigmaTokensResult | null>;
    /**
     * Retrieves the authenticated Figma user's profile using the access token.
     * @param accessToken OAuth access token
     */
    getFigmaProfile(accessToken: string): Promise<FigmaProfile | null>;
    private generateRandomPassword;
    /**
     * Format social profile to a similar project data object
     * @param profile User social profile object
     */
    private formatProfile;
    /**
     * Authenticate user social profile after social confirmation
     * @param profile User social profile object
     */
    authenticateUserProfile(userProfile: GoogleProfile | FigmaProfile, next: NextFunction): Promise<any>;
    /**
     * Send out a welcome mail on succesful profile authentication
     * @param authPayload User social profile object
     */
    sendOAuthWelcomeMail(authPayload: any, next: NextFunction): Promise<void>;
}
declare const _default: OAuthService;
export default _default;
