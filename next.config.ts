import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(webpackConfig) {
    return {
      ...webpackConfig,
      optimization: {
        minimize: false
      }
    };
  }
};

export default nextConfig;
