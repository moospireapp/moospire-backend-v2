import { JwtPayload } from "jsonwebtoken";
import { IUser, UserRole } from "../../../types/user-type.js";
import { Request } from "express";
interface PaginationOptions {
    total: number;
    page: number;
}
interface DecodedToken extends JwtPayload {
    user_id: string;
    email: string;
    role?: UserRole;
}
declare class AuthService {
    /**
     * Check if email exists in the database.
     * @param email - The email address to check.
     * @param booleanType - If true, return true or false, otherwise return the user object.
     */
    checkEmailExist(email: string, booleanType?: boolean): Promise<boolean | IUser | string | null>;
    /**
     * Hash the provided password using bcrypt.
     * @param password - The password to be hashed.
     * @returns The hashed password.
     */
    hashPassword(password: string): Promise<string>;
    /**
     * Compare the provided password with the stored hash.
     * @param password - The password entered by the user.
     * @param hash - The stored hashed password.
     * @returns Boolean indicating if the password matches the hash.
     */
    compareHashPassword(password: string, hash: string): Promise<boolean | string>;
    /**
     * Generate a signed JWT token.
     * @param data - Data to be signed in the token.
     * @param expiresIn - Token expiration time.
     * @returns The signed token.
     */
    signToken(data: object, expiresIn?: string | undefined): Promise<string>;
    /**
     * Verify the provided JWT token.
     * @param token - The token to verify.
     * @returns The decoded token data.
     */
    verifyToken(token: string): Promise<DecodedToken | string>;
    /**
     * Generate user OTP token and store value in redis store
     * @param userEmail - The userEmail to that initiated the otp.
     * @param length - The length of the generated otp.
     * @returns The otp token data.
     */
    generateUserOTP(userEmail: string, length?: number): Promise<string>;
    /**
     * Get the current user ID from request headers.
     * @param requestHeaders - The request headers containing the authorization token.
     * @returns The user ID.
     */
    getCurrentUserId(requestHeaders: Request["headers"]): Promise<DecodedToken | string>;
    /**
     * Generate signed authentication payload.
     * @param userData - User data retrieved from the database.
     * @returns Object containing the user's name, email, role, and JWT token.
     */
    generateUserPayload(userData: IUser, withToken?: boolean): Promise<object | string>;
    /**
     * Validate user sign-in by checking email and password.
     * @param email - The user's email.
     * @param password - The user's password.
     * @param next - Express.js next function for handling middleware.
     * @returns Signed token or error response.
     */
    validateUserSignIn(email: string, password: string, next: Function): Promise<any>;
    /**
     * Check if a user account has been archived already.
     * @param email - The user's email.
     * @param next - Express.js next function for handling middleware.
     * @returns true if user has been archived or false if otherwise
     */
    checkUserArchivedState(email: string, next: Function): Promise<boolean>;
    /**
     * Render paginated payload for a data list.
     * @param data - List of items.
     * @param options - Pagination options containing total and current page.
     * @returns Formatted paginated payload.
     */
    renderPaginatedPayload(data: object[], options: PaginationOptions): object;
    /**
     * Send API response to client.
     * @param responseMessage - Message to send in the response.
     * @param next - Express.js next function.
     * @param status - API error response status.
     * @returns False indicating the response has been sent.
     */
    private sendResponse;
}
declare const _default: AuthService;
export default _default;
