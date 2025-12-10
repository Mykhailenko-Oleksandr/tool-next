import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Змінити хост для зображень
    remotePatterns: [{ protocol: "https", hostname: "ac.goit.global" }],
  },
};

export default nextConfig;
