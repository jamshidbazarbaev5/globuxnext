/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'globus-nukus.uz',
        pathname: '/**',
      },
    ],
    unoptimized: true,
    domains: ['globus-nukus.uz'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://globus-nukus.uz/api/:path*',
      },
    ]
  },
  reactStrictMode: true,
  optimizePackageImports: ['react-icons','@material-ui/core',''],
};

module.exports = nextConfig;
