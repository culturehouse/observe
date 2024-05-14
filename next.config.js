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
            value: "public, max-age=100, s-maxage=100, must-revalidate",
          },
        ],
      },
    ];
  },
  // reactStrictMode: false,
};
