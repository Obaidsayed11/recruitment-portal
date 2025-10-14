
import { User } from "../types/interface";

declare module "next-auth" {
  interface User {
    id: number;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
  interface Session {
    user: {
      id: number;
      fullName: string;
      role: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}
