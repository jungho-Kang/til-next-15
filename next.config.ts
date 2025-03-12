import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
    ],
  },
  // BE API 호출 시 과정 및 Data Cache 정보
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
