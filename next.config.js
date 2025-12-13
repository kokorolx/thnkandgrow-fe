/** @type {import('next').NextConfig} */

// Parse hostname from environment variable URL
const parseHostname = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return 'blog.thnkandgrow.com'; // fallback
  }
};

const wordpressHostname = parseHostname(
  process.env.WORDPRESS_API_URL || 'https://blog.thnkandgrow.com/graphql'
);

const cloudfrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'd1gj38atnczo72.cloudfront.net';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: wordpressHostname,
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: cloudfrontDomain,
      },
      {
        protocol: 'https',
        hostname: 'www.apple.com',
      },
    ],
  },
};

module.exports = nextConfig;
