import { Request } from "express";

/* Define the user profile payload interface */
export interface UserProfileRequest extends Request {
  body: {
    user_data: string[];
  };
}

/* Define the user profile type payload interface */
export interface UserProfileTypeRequest extends Request {
  body: {
    user_type: string;
  };
}
