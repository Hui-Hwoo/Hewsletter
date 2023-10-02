/** @type {import('next').NextConfig} */

const CorsHeaders = [
  { key: "Access-Control-Allow-Credentials", value: "true" },
  { key: "Access-Control-Allow-Origin", value: "*" },
  {
    key: "Access-Control-Allow-Methods",
    value: "*",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "*",
  },
  {
    key: "Access-Control-Max-Age",
    value: "86400",
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ...CorsHeaders,
          // {
          //   key: "Cross-Origin-Opener-Policy",
          //   value: "same-origin-allow-popups",
          // },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
