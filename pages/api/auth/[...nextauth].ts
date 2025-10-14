import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/lib/axiosInterceptor";

interface Credentials {
  phone: string;
  otp: string;
  verificationId: string;
}

async function refreshAccessToken(token: any) {
  try {
    console.log("Refreshing access token...");
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken: token.refreshToken,
    });

    if (!response.data.accessToken) {
      throw new Error("Failed to refresh token");
    }

    const decodedToken = jwtDecode<{ exp?: number }>(response.data.accessToken);
    if (!decodedToken.exp) {
      throw new Error("No Expiry in decoded token");
    }

    console.log("New access token received:", response.data.accessToken);
    return {
      ...token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken || token.refreshToken,
      accessTokenExpires: decodedToken.exp * 1000,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        verificationId: { label: "Verification ID", type: "text" },
      },

      async authorize(credentials) {
        const { phone, otp, verificationId } = credentials as Credentials;

        try {
          const response = await apiClient.post("/auth/login/otp/verify", {
            phone,
            otp,
            verificationId,
          });

          console.log("API Response:", response.data);
          const user = response.data.user;

          if (!user) throw new Error("Invalid Phone, OTP, or verificationId");

          return {
            id: user.id,
            fullName: user.fullName,
            role: user.role,
            accessToken: user.token,
            refreshToken: user.refreshToken,
          };
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Login failed. Please try again.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.fullName = user.fullName;
        token.role = user.role;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        fullName: token.fullName,
        role: token.role,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      return session;
    },
  },
  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/error",
  },

  debug: true,
});
