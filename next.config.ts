import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(), // Prevent Turbopack scanning above sap-chatbot/
  },
};

export default nextConfig;
