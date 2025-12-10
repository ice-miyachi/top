import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
