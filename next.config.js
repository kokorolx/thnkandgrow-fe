/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.thnkandgrow.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'd1gj38atnczo72.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'www.apple.com',
      },
    ],
  },
};

module.exports = nextConfig;
