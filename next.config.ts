import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    },
};

module.exports = nextConfig;

export default nextConfig;



