/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'globus-nukus.uz/',
        pathname: '/**',
      },
    ],
  },
  
  optimizePackageImports: ['react-icons','@material-ui/core',''],
};

module.exports = nextConfig;
