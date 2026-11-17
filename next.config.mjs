/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'content.homenetiol.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.marketcheck.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.foxdealer.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-ogamoto.itechnolabs.tech',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-okomoto.itechnolabs.co.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nissanusa.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ogamoto-s3-bucket.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
