// Define the structure of Google and Figma tokens and profiles
export interface GoogleTokensResult {
  access_token: string;
  id_token: string;
  token_type: string;
  scope: string;
  expiry_date: number;
}

export interface FigmaTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface GoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface FigmaProfile {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

export interface SocialProfile {
  firstName: string;
  lastName: string;
  email: string;
  image: {
    id: string | null;
    url: string;
  };
}
