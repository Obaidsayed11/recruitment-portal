import { BACKEND_URL } from "@/config";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    
    const session = await getSession();
    if (session?.user.accessToken && session.user.refreshToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      config.headers["x-refresh-token"] = `${session.user.refreshToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 440) {
      await signOut();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
