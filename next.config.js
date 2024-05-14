module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "observe-images.s3.amazonaws.com",
      },
    ],
    minimumCacheTTL: 0,
  },
  async headers() {
    return [
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=70, s-maxage=80, must-revalidate",
          },
          {
            key: "X-Vercel-Cache",
            value: "MISS",
          },
        ],
      },
    ];
  },
  // reactStrictMode: false,
};
