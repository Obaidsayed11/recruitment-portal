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
      companyId: string | null
    } & DefaultSession["user"];
  
  }

  interface User {
    id: string | number;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    companyId: string | null
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
    companyId: string | null
  }
}

