import { httpStatus } from "../core/index.js";
import { env } from "../config/index.js";
/**
 * Class representing an API response.
 */
class ApiResponse extends Error {
    status;
    code;
    message;
    error;
    /**
     * APIResponse class constructor
     * @param status - HTTP status.
     * @param code - The status code.
     * @param message - The status message.
     * @param error - The descriptive error message.
     */
    constructor(status, code, message, error) {
        super(message);
        this.status = status;
        this.code = code;
        this.message = message;
        this.error = error;
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Creates a new ApiResponse object based on the given response object.
     * @param response - The response object returned by the API.
     * @param error - An optional descriptive error message.
     * @returns A new ApiResponse object.
     */
    static renderApiResponse(response, error = "") {
        return new ApiResponse(response.code >= 400 ? "error" : "success", response.code, response.message, error);
    }
}
/* An object containing different HTTP status responses */
const apiStatus = {
    /* 2** status responses */
    success: () => ApiResponse.renderApiResponse(httpStatus.success),
    created: () => ApiResponse.renderApiResponse(httpStatus.created),
    noContent: () => ApiResponse.renderApiResponse(httpStatus.noContent),
    /* 4** status responses */
    badRequest: (error) => ApiResponse.renderApiResponse(httpStatus.badRequest, error),
    unauthorized: (error) => ApiResponse.renderApiResponse(httpStatus.unauthorized, error),
    forbidden: (error) => ApiResponse.renderApiResponse(httpStatus.forbidden, error),
    notFound: (error) => ApiResponse.renderApiResponse(httpStatus.notFound, error),
    noMethod: (error) => ApiResponse.renderApiResponse(httpStatus.noMethod, error),
    conflict: (error) => ApiResponse.renderApiResponse(httpStatus.conflict, error),
    unProcessable: (error) => ApiResponse.renderApiResponse(httpStatus.unProcessable, error),
    manyRequest: (error) => ApiResponse.renderApiResponse(httpStatus.manyRequest, error),
    /* 5** status responses */
    internal: (error) => ApiResponse.renderApiResponse(httpStatus.internal, error),
};
/**
 * Sends a token cookie to the client headers.
 * @param res - The Express response object.
 * @param token - The authenticated user token.
 */
const serveCookieResponse = (res, token, expireCookie = false) => {
    // Ensure the COOKIE_OPTIONS has the correct sameSite type
    const cookieOptions = {
        httpOnly: env.COOKIE_OPTIONS.httpOnly,
        path: env.COOKIE_OPTIONS.path,
        secure: env.COOKIE_OPTIONS.secure,
        sameSite: env.COOKIE_OPTIONS.sameSite,
        maxAge: expireCookie ? 0 : env.COOKIE_OPTIONS.maxAge,
    };
    res.cookie("token", token, cookieOptions);
};
/**
 * Sends a formatted API response back to the client.
 * @param res - The Express response object.
 * @param responseData - The ApiResponse object containing status, code, message, and optional error.
 * @param extraData - Additional data to include in the response payload.
 * @returns A JSON response.
 */
const respondWith = (res, responseData, extraData = {}) => {
    // Creating a payload object for the response
    let payload = {
        status: responseData.status,
        code: responseData.code,
        message: responseData.message,
        ...extraData,
    };
    if (responseData.error) {
        payload.error = responseData.error;
    }
    // Add stack trace in development environment if the status is "Error"
    if (env.APP_ENV === "development" && payload.status === "Error") {
        payload.stack = responseData.stack;
    }
    // Sending the response to the client
    res.status(responseData.code).json(payload);
    return false;
};
export { ApiResponse, apiStatus, serveCookieResponse, respondWith };
//# sourceMappingURL=http-response-handler.js.map