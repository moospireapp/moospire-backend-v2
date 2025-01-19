import { Response } from "express";
interface IApiResponse {
    status: string;
    code: number;
    message: string;
    error?: string;
}
/**
 * Class representing an API response.
 */
declare class ApiResponse extends Error implements IApiResponse {
    status: string;
    code: number;
    message: string;
    error?: string;
    /**
     * APIResponse class constructor
     * @param status - HTTP status.
     * @param code - The status code.
     * @param message - The status message.
     * @param error - The descriptive error message.
     */
    constructor(status: string, code: number, message: string, error?: string);
    /**
     * Creates a new ApiResponse object based on the given response object.
     * @param response - The response object returned by the API.
     * @param error - An optional descriptive error message.
     * @returns A new ApiResponse object.
     */
    static renderApiResponse(response: {
        code: number;
        message: string;
    }, error?: string): ApiResponse;
}
declare const apiStatus: {
    success: () => ApiResponse;
    created: () => ApiResponse;
    noContent: () => ApiResponse;
    badRequest: (error?: string) => ApiResponse;
    unauthorized: (error?: string) => ApiResponse;
    forbidden: (error?: string) => ApiResponse;
    notFound: (error?: string) => ApiResponse;
    noMethod: (error?: string) => ApiResponse;
    conflict: (error?: string) => ApiResponse;
    unProcessable: (error?: string) => ApiResponse;
    manyRequest: (error?: string) => ApiResponse;
    internal: (error?: string) => ApiResponse;
};
/**
 * Sends a token cookie to the client headers.
 * @param res - The Express response object.
 * @param token - The authenticated user token.
 */
declare const serveCookieResponse: (res: Response, token: string, expireCookie?: boolean) => void;
/**
 * Sends a formatted API response back to the client.
 * @param res - The Express response object.
 * @param responseData - The ApiResponse object containing status, code, message, and optional error.
 * @param extraData - Additional data to include in the response payload.
 * @returns A JSON response.
 */
declare const respondWith: (res: Response, responseData: ApiResponse, extraData?: Record<string, any>) => boolean;
export { ApiResponse, apiStatus, serveCookieResponse, respondWith };
