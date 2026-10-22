import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    ".monkeycode-ai.live",
    "*.monkeycode-ai.live",
    ".run.app",
    "*.run.app",
    ".asia-southeast1.run.app",
    "*.asia-southeast1.run.app",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
