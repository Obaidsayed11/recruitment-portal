import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/lib/axiosInterceptor";

interface Credentials {
  email: string;
  password: string;
}

interface MyToken {
  id: string;
  fullName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}

async function refreshAccessToken(token: MyToken) {
  try {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken: token.refreshToken,
    });
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    const decodedToken = jwtDecode<{ exp?: number }>(newAccessToken);

    return {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken || token.refreshToken,
      accessTokenExpires: decodedToken.exp! * 1000,
    };
  } catch (error) {
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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as Credentials;

        const response = await apiClient.post("/auth/login", { email, password });
        const user = response.data.user;

        if (!user) return null;

        return {
          id: user.id,
          fullName: user.fullName,
          accessToken: user.token,
          refreshToken: user.refreshToken,
          role: user.role,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ✅ Persist all important fields in JWT
        return {
          id: user.id,
          fullName: user.fullName,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
        };
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token as MyToken);
    },

    async session({ session, token }) {
      // ✅ Map the JWT token to session.user
      session.user = {
        id: (token as MyToken).id,
        fullName: (token as MyToken).fullName,
        role: (token as MyToken).role,
        accessToken: (token as MyToken).accessToken,
        refreshToken: (token as MyToken).refreshToken,
      };
      return session;
    },
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  debug: true,
});
