/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/event-source",
        destination: "/api/sse",
      },
    ];
  },
};

module.exports = nextConfig;
