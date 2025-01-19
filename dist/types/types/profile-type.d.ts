import { Request } from "express";
export interface UserProfileRequest extends Request {
    body: {
        user_data: string[];
    };
}
export interface UserProfileTypeRequest extends Request {
    body: {
        user_type: string;
    };
}
