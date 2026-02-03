/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'media.tenor.com',
      },
      {
        protocol: 'https',
        hostname: 'media1.tenor.com',
      },
      {
        protocol: 'https',
        hostname: 'i.gifer.com',
      },
    ],
  },
}

module.exports = nextConfig

