import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as otpGenerator from "otp-generator";
import { env, appLogger, redisClient } from "../../config/index.js";
import { apiStatus } from "../../core/index.js";
import { User } from "../../models/index.js";
class AuthService {
    /**
     * Check if email exists in the database.
     * @param email - The email address to check.
     * @param booleanType - If true, return true or false, otherwise return the user object.
     */
    async checkEmailExist(email, booleanType = true) {
        try {
            const isExist = await User.findOneByEmail(email);
            return booleanType ? !!isExist : isExist;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            appLogger.error(errorMessage);
            return errorMessage;
        }
    }
    /**
     * Hash the provided password using bcrypt.
     * @param password - The password to be hashed.
     * @returns The hashed password.
     */
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(Number(env.SALT_ROUND));
            return await bcrypt.hash(password, salt);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            appLogger.error(errorMessage);
            return errorMessage;
        }
    }
    /**
     * Compare the provided password with the stored hash.
     * @param password - The password entered by the user.
     * @param hash - The stored hashed password.
     * @returns Boolean indicating if the password matches the hash.
     */
    async compareHashPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            appLogger.error(errorMessage);
            return errorMessage;
        }
    }
    /**
     * Generate a signed JWT token.
     * @param data - Data to be signed in the token.
     * @param expiresIn - Token expiration time.
     * @returns The signed token.
     */
    async signToken(data, expiresIn = env.TOKEN_LIFE) {
        try {
            if (!env.APP_SECRET) {
                throw new Error("APP_SECRET is not defined. Cannot sign token.");
            }
            return jwt.sign(data, env.APP_SECRET, { expiresIn });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            appLogger.error(errorMessage);
            return errorMessage;
        }
    }
    /**
     * Verify the provided JWT token.
     * @param token - The token to verify.
     * @returns The decoded token data.
     */
    async verifyToken(token) {
        try {
            if (!env.APP_SECRET) {
                throw new Error("APP_SECRET is not defined. Cannot verify token.");
            }
            return jwt.verify(token, env.APP_SECRET);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            appLogger.error(errorMessage);
            return errorMessage;
        }
    }
    /**
     * Generate user OTP token and store value in redis store
     * @param userEmail - The userEmail to that initiated the otp.
     * @param length - The length of the generated otp.
     * @returns The otp token data.
     */
    async generateUserOTP(userEmail, length = 6) {
        const otp = otpGenerator.generate(length, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        if (!env.OTP_TIME_TO_LIFE) {
            throw new Error("OTP_TIME_TO_LIFE is not defined. Cannot store otp token.");
        }
        // Convert the OTP_TIME_TO_LIFE to a number
        const ttl = Number(env.OTP_TIME_TO_LIFE);
        // Check if the OTP key already exists
        const existingOtp = await redisClient.get(`otp-${userEmail}`);
        if (existingOtp) {
            // If it exists, remove the existing entry
            await redisClient.del(`otp-${userEmail}`);
        }
        // Set the new OTP in Redis
        await redisClient.setEx(`otp-${userEmail}`, ttl, otp);
        return otp;
    }
    /**
     * Get the current user ID from request headers.
     * @param requestHeaders - The request headers containing the authorization token.
     * @returns The user ID.
     */
    async getCurrentUserId(requestHeaders) {
        try {
            const bearerToken = requestHeaders["authorization"]?.split(" ")[1];
            if (!bearerToken)
                throw new Error("Authorization token not provided");
            const verifiedToken = await this.verifyToken(bearerToken);
            // Type narrowing: check if verifiedToken is of type DecodedToken
            if (typeof verifiedToken !== "string" && "user_id" in verifiedToken) {
                return verifiedToken.user_id;
            }
            throw new Error("Invalid token format or missing user_id");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            appLogger.error(errorMessage);
            return errorMessage;
        }
    }
    /**
     * Generate signed authentication payload.
     * @param userData - User data retrieved from the database.
     * @returns Object containing the user's name, email, role, and JWT token.
     */
    async generateUserPayload(userData, withToken = true) {
        try {
            let token = null;
            if (withToken) {
                token = await this.signToken({
                    user_id: userData._id,
                    current_user: { ...userData.toObject() },
                });
            }
            let userPayload = {
                id: userData._id,
                fullname: `${userData?.firstName} ${userData?.lastName}`,
                email: userData?.email,
                phone: userData?.phone,
                about: userData?.about,
                image: userData?.image?.url ? userData?.image.url : null,
                experienceLevel: userData?.experienceLevel,
                userRoles: userData?.userRole,
                userGoals: userData?.userGoal,
                userPreferences: userData?.userPreference,
                userType: userData?.userType,
                isVerified: userData?.isVerified,
                isOnboarded: !!(userData?.userRole.length &&
                    userData?.userGoal.length &&
                    userData?.userPreference.length),
                createdAt: userData?.createdAt,
            };
            return withToken ? { user: userPayload, token } : userPayload;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            appLogger.error(errorMessage);
            return errorMessage;
        }
    }
    /**
     * Validate user sign-in by checking email and password.
     * @param email - The user's email.
     * @param password - The user's password.
     * @param next - Express.js next function for handling middleware.
     * @returns Signed token or error response.
     */
    async validateUserSignIn(email, password, next) {
        try {
            const emailExist = await this.checkEmailExist(email, false);
            // Narrow the type to ensure emailExist is an array of IUser[]
            if (emailExist !== null &&
                emailExist !== undefined &&
                typeof emailExist === "object") {
                const isPasswordValid = await this.compareHashPassword(password, emailExist.password);
                if (isPasswordValid === true) {
                    return this.generateUserPayload(emailExist);
                }
                else {
                    return this.sendResponse("User password is not correct", next);
                }
            }
            else if (typeof emailExist === "string") {
                return this.sendResponse(emailExist, next);
            }
            else {
                return this.sendResponse("User email does not exist", next);
            }
        }
        catch (error) {
            appLogger.error(error);
            return this.sendResponse("An error occurred while checking email", next, "internal");
        }
    }
    /**
     * Check if a user account has been archived already.
     * @param email - The user's email.
     * @param next - Express.js next function for handling middleware.
     * @returns true if user has been archived or false if otherwise
     */
    async checkUserArchivedState(email, next) {
        try {
            const emailExist = await this.checkEmailExist(email, false);
            if (emailExist &&
                typeof emailExist === "object" &&
                "isArchived" in emailExist &&
                emailExist.isArchived) {
                return this.sendResponse("Please contact support to activate your account", next);
            }
            else {
                return false;
            }
        }
        catch (error) {
            appLogger.error(error);
            return this.sendResponse("An error occurred while checking email", next, "internal");
        }
    }
    /**
     * Render paginated payload for a data list.
     * @param data - List of items.
     * @param options - Pagination options containing total and current page.
     * @returns Formatted paginated payload.
     */
    renderPaginatedPayload(data, options) {
        return {
            data,
            pagination: {
                total: options.total,
                page: options.page,
                per_page: env.PER_PAGE,
                pages: Math.ceil(options.total / env.PER_PAGE),
            },
        };
    }
    /**
     * Send API response to client.
     * @param responseMessage - Message to send in the response.
     * @param next - Express.js next function.
     * @param status - API error response status.
     * @returns False indicating the response has been sent.
     */
    sendResponse(responseMessage, next, status = "unauthorized" // Restrict status to valid keys
    ) {
        next(apiStatus[status](responseMessage)); // Now this is type-safe
        return false;
    }
}
export default new AuthService();
//# sourceMappingURL=auth-services.js.map