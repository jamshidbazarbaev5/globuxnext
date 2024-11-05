/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['globus-nukus.uz'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  // Any other configurations you need...
};

module.exports = nextConfig;
