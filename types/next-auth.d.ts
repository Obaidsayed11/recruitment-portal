import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string | number;
      fullName: string;
      role: string;
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  
  }

  interface User {
    id: string | number;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string | number;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
  }
}

