import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src *",
              "frame-ancestors *",
              "frame-src * https://www.youtube.com https://www.youtube-nocookie.com https://*.notion.site https://*.notion.so",
              "child-src * https://*.notion.site https://*.notion.so",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.notion.so https://*.notion.site",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;