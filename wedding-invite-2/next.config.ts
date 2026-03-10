import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias["next/dist/compiled/next-devtools"] = path.resolve(
        __dirname,
        "src/shims/next-devtools.ts"
      );
    }
    return config;
  },
};

export default nextConfig;
