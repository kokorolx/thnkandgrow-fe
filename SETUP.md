# Setup Guide

This guide will help you set up the project locally and prepare it for deployment.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A WordPress GraphQL endpoint (WPGraphQL plugin)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/thnkandgrow-fe.git
cd thnkandgrow-fe
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# GraphQL API Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
WORDPRESS_AUTH_REFRESH_TOKEN=your_refresh_token_here

# Site Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=your-cloudfront-distribution.cloudfront.net

# Optional: Cache & Revalidation
REVALIDATION_SECRET=your_secret_key_for_revalidation
```

### Environment Variable Details

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `WORDPRESS_API_URL` | string | Yes | WordPress GraphQL endpoint URL |
| `WORDPRESS_AUTH_REFRESH_TOKEN` | string | No | Bearer token for authenticated GraphQL requests |
| `NEXT_PUBLIC_BASE_URL` | string | Yes | Base URL of your website (e.g., https://blog.thnkandgrow.com) |
| `NEXT_PUBLIC_CLOUDFRONT_DOMAIN` | string | No | CloudFront distribution domain for CDN |
| `REVALIDATION_SECRET` | string | No | Secret key for ISR revalidation endpoint |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and should not contain secrets.

## Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9999`

### Other Available Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm lint

# Download and cache GraphQL data
npm run cache:download

# Build with cached data
npm run build:cached

# Warm cache
npm run warm-cache

# Build and warm cache
npm run build:warm
```

## Getting WordPress Credentials

### WordPress GraphQL Endpoint

1. Ensure your WordPress site has the [WPGraphQL plugin](https://www.wpgraphql.com/) installed
2. Your GraphQL endpoint will be available at: `https://your-site.com/graphql`

### Authentication Token

If your API requires authentication:

1. Install the [WPGraphQL JWT Authentication](https://github.com/wp-graphql/wp-graphql-jwt-authentication) plugin
2. Generate a refresh token for your user account
3. Add the token to `WORDPRESS_AUTH_REFRESH_TOKEN` in your `.env.local`

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── posts/          # Blog posts pages
│   ├── portfolio/      # Portfolio pages
│   └── layout.tsx      # Root layout
├── components/         # React components
├── lib/               # Utility functions and configurations
│   ├── apollo.ts      # Apollo Client setup
│   └── queries.ts     # GraphQL queries
├── data/              # Static data
└── styles/            # Global styles
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Vercel will automatically deploy on push

### Self-Hosted

```bash
# Build the application
npm run build

# Start the server
npm start
```

The application will listen on port 9999 by default (configured in package.json).

## Troubleshooting

### GraphQL Connection Issues

- Verify `WORDPRESS_API_URL` is correct
- Check if WordPress site is accessible
- Ensure WPGraphQL plugin is active
- Check authentication token if using protected endpoints

### Build Failures

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Cache Issues

- Clear cache directory: `rm -rf .cache`
- Re-download GraphQL data: `npm run cache:download`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is open source under the MIT License. See LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainers.
