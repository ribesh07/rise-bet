import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Exclude SVG from Next default loader
    config.module?.rules?.forEach((rule: any) => {
      if (rule.test?.toString().includes("svg")) {
        rule.exclude = /\.svg$/;
      }
    });

    // Add SVGR loader
    config.module?.rules?.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
