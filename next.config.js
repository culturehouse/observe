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
        source: "https://culturehouse-dev.vercel.app/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  // reactStrictMode: false,
};
