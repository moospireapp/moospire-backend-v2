import { NextFunction } from "express";
import axios from "axios";
import querystring from "querystring";
import { google } from "googleapis";
import { authService } from "@/modules/auth-module/index.js";
import { apiStatus, emailHandler } from "@/core/index.js";
import { env, appLogger } from "@/config/index.js";
import { User } from "@/models/index.js";
import { UserRole } from "@/types/user-type.js";
import {
  GoogleTokensResult,
  FigmaTokensResult,
  GoogleProfile,
  FigmaProfile,
  SocialProfile,
} from "@/types/o-user-type";

class OAuthService {
  private GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
  private GOOGLE_PROFILE_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
  private FIGMA_OAUTH_TOKEN_URL = "https://www.figma.com/api/oauth/token";
  private FIGMA_PROFILE_URL = "https://api.figma.com/v1/me";
  private googleOauthClient: any;

  constructor() {
    this.googleOauthClient = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${env.APP_CLIENT_BASE_DOMAIN}/oauth-verify`
    );
  }

  /**
   * Generates the Google OAuth2 authorization URL.
   */
  public getGoogleAuthorizationUrl(): string {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    return this.googleOauthClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      include_granted_scopes: true,
    });
  }

  /**
   * Retrieves OAuth tokens from Google using the provided authorization code.
   * @param code Authorization code from Google
   */
  public async getGoogleOauthTokens(
    code: string
  ): Promise<GoogleTokensResult | null> {
    const values = {
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${env.APP_CLIENT_BASE_DOMAIN}/oauth-verify`,
      grant_type: "authorization_code",
    };

    try {
      const response = await axios.post<GoogleTokensResult>(
        this.GOOGLE_OAUTH_TOKEN_URL,
        querystring.stringify(values),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      return response.data;
    } catch (err: any) {
      console.error("Error fetching Google OAuth tokens:", err);
      return null;
    }
  }

  /**
   * Retrieves the user's Google profile using access and ID tokens.
   * @param accessToken OAuth access token
   * @param idToken ID token for authentication
   */
  public async getGoogleProfile(
    accessToken: string,
    idToken: string
  ): Promise<GoogleProfile | null> {
    try {
      const response = await axios.get<GoogleProfile>(
        `${this.GOOGLE_PROFILE_URL}?alt=json&access_token=${accessToken}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching Google profile:", error);
      return null;
    }
  }

  /**
   * Generates the Figma OAuth authorization URL.
   */
  public getFigmaAuthorizationUrl(): string {
    const scopes = ["file_read"];
    return `https://www.figma.com/oauth?client_id=${
      env.FIGMA_CLIENT_ID
    }&redirect_uri=${
      env.APP_CLIENT_BASE_DOMAIN
    }/oauth-verify&scope=${scopes.join(" ")}&state=state&response_type=code`;
  }

  /**
   * Retrieves OAuth tokens from Figma using the provided authorization code.
   * @param code Authorization code from Figma
   */
  public async getFigmaOauthTokens(
    code: string
  ): Promise<FigmaTokensResult | null> {
    const values = {
      client_id: env.FIGMA_CLIENT_ID,
      client_secret: env.FIGMA_CLIENT_SECRET,
      redirect_uri: `${env.APP_CLIENT_BASE_DOMAIN}/oauth-verify`,
      code,
      grant_type: "authorization_code",
    };

    try {
      const response = await axios.post<FigmaTokensResult>(
        this.FIGMA_OAUTH_TOKEN_URL,
        querystring.stringify(values),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      return response.data;
    } catch (err: any) {
      console.error("Error fetching Figma OAuth tokens:", err);
      return null;
    }
  }

  /**
   * Retrieves the authenticated Figma user's profile using the access token.
   * @param accessToken OAuth access token
   */
  public async getFigmaProfile(
    accessToken: string
  ): Promise<FigmaProfile | null> {
    try {
      const response = await axios.get<FigmaProfile>(this.FIGMA_PROFILE_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching Figma profile:", error);
      return null;
    }
  }

  private generateRandomPassword(length = 12) {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";

    const allCharacters =
      uppercaseLetters + lowercaseLetters + numbers + specialCharacters;

    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters[randomIndex];
    }

    return password;
  }

  /**
   * Format social profile to a similar project data object
   * @param profile User social profile object
   */
  private formatProfile(profile: GoogleProfile | FigmaProfile): SocialProfile {
    if ("given_name" in profile && "family_name" in profile) {
      // It's a Google profile
      return {
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        image: {
          id: null,
          url: profile.picture,
        },
      };
    } else if ("handle" in profile && "img_url" in profile) {
      // It's a Figma profile
      return {
        firstName: profile.handle.split(" ")[0],
        lastName: profile.handle.split(" ")[1] || "",
        email: profile.email,
        image: {
          id: null,
          url: profile.img_url,
        },
      };
    }

    throw new Error("Unsupported profile type");
  }

  /**
   * Authenticate user social profile after social confirmation
   * @param profile User social profile object
   */
  public async authenticateUserProfile(
    userProfile: GoogleProfile | FigmaProfile,
    next: NextFunction
  ): Promise<any> {
    try {
      const profile = this.formatProfile(userProfile);

      const emailExist = await authService.checkEmailExist(
        profile.email,
        false
      );

      if (
        emailExist !== null &&
        emailExist !== undefined &&
        typeof emailExist === "object"
      ) {
        // Initiate user login
        return await authService.generateUserPayload(emailExist);
      } else {
        // Initiate user signup
        const userPayload = await User.create({
          ...profile,
          password: this.generateRandomPassword(),
          isVerified: true,
          role:
            profile.email === env.SUPER_ADMIN_EMAIL
              ? UserRole.SUPERADMIN
              : UserRole.REGULAR,
        });

        if (typeof userPayload === "object") {
          // SEND OUT A WELCOME MAIL
          this.sendOAuthWelcomeMail(userPayload, next);

          return await authService.generateUserPayload(userPayload);
        } else {
          next(
            apiStatus.internal("An error occurred while creating user profile")
          );
          return false;
        }
      }
    } catch (error: any) {
      appLogger.error(error);
      next(
        apiStatus.internal(
          "An error occurred while authenticating user profile"
        )
      );
      return false;
    }
  }

  /**
   * Send out a welcome mail on succesful profile authentication
   * @param authPayload User social profile object
   */
  public async sendOAuthWelcomeMail(
    authPayload: any,
    next: NextFunction
  ): Promise<void> {
    try {
      const { firstName, lastName, email } = authPayload;

      // Prepare welcome mail
      const mailOptions = {
        to: email,
        subject: "Welcome to Moospire",
      };
      const templateOptions = {
        fullName: `${firstName} ${lastName}`,
      };

      // Send out user welcome mail
      emailHandler.sendEmail(
        mailOptions,
        "welcome-oauth",
        templateOptions,
        next
      );
    } catch (error) {
      appLogger.error(error);
      return;
    }
  }
}

export default new OAuthService();
