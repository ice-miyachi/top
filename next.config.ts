import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors *; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.notion.site https://*.notion.so; child-src 'self' https://*.notion.site https://*.notion.so;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
