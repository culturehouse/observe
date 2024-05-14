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
  // reactStrictMode: false,
};
