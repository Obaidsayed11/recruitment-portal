import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: ".next",
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.quickcraves.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "192.168.102.142",
        pathname: "**",
      },
    ],
  },

  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    BASE_URL: process.env.BASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  webpack: (config: {
    resolve: { fallback: { fs: boolean; net: boolean; tls: boolean } };
    module: { rules: { test: RegExp; use: { loader: string }[] }[] };
  }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.module.rules.push({
      test: /\.(node)$/i,
      use: [
        {
          loader: "file-loader",
        },
      ],
    });
    return config;
  },

  async headers() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === "development", // Disable PWA in development
};

export default withPWA(pwaConfig)(nextConfig);
