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
            value: "public, no-cache, no-store, max-age=0, s-maxage=0, must-revalidate",
          },
        ],
      },
    ];
  },
  // reactStrictMode: false,
};
