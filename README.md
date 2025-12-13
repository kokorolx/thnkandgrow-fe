# ThnkAndGrow Blog

A modern, high-performance blog platform built with [Next.js](https://nextjs.org) 16 and a headless WordPress CMS. Features a pixel-perfect Apple Newsroom-inspired design with advanced functionality like Text-to-Speech reading and Incremental Static Regeneration.

## Features

- **Next.js 16 App Router** - Latest Next.js framework with Turbopack
- **Headless WordPress CMS** - Content management via GraphQL (WPGraphQL)
- **Incremental Static Regeneration (ISR)** - Fast page loads with fresh content
- **Text-to-Speech Reader** - Built-in audio reading with progress tracking
- **SEO Optimized** - Robots.txt, Sitemaps, Structured Data, Open Graph
- **Responsive Design** - Modern design inspired by Apple Newsroom
- **TypeScript** - Full type safety
- **Apollo Client** - Efficient GraphQL data fetching
- **CSS Modules** - Scoped component styling
- **Image Optimization** - CDN support with CloudFront

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- WordPress site with WPGraphQL plugin

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thnkandgrow-fe.git
cd thnkandgrow-fe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Setup Guide](./SETUP.md)):
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:9999](http://localhost:9999) in your browser.

## Documentation

- **[Setup Guide](./SETUP.md)** - Detailed setup and configuration instructions
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project
- **[Environment Variables](./SETUP.md#environment-variables)** - Configuration reference

## Project Structure

```
src/
├── app/              # Next.js app directory pages and layouts
│   ├── api/         # API routes
│   ├── posts/       # Blog post pages
│   ├── portfolio/   # Portfolio showcase
│   └── layout.tsx   # Root layout
├── components/       # React components
├── lib/             # Utilities and configurations
│   ├── apollo.ts    # Apollo Client setup
│   └── queries.ts   # GraphQL queries
├── data/            # Static data and portfolio
└── styles/          # Global styles
```

## Available Commands

```bash
# Development
npm run dev                 # Start dev server with Turbopack

# Production
npm run build              # Build for production
npm run start              # Start production server

# Utilities
npm run lint              # Run ESLint
npm run cache:download    # Download GraphQL data to cache
npm run build:cached      # Build with cached data
npm run warm-cache        # Warm the cache
npm run build:warm        # Build and warm cache
```

## Technologies

- **Frontend**: React 19, Next.js 16, TypeScript
- **CMS**: WordPress with WPGraphQL
- **Data Fetching**: Apollo Client
- **Styling**: CSS Modules
- **Deployment**: Vercel (recommended) or self-hosted

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- Code standards
- Pull request process
- Commit message guidelines
- Development workflow

## Deployment

### Vercel (Recommended)
The easiest way to deploy is with [Vercel](https://vercel.com):
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in dashboard
4. Auto-deploy on every push

### Self-Hosted
```bash
npm run build
npm start
```

See [Setup Guide - Deployment](./SETUP.md#deployment) for more options.

## Troubleshooting

See [Setup Guide - Troubleshooting](./SETUP.md#troubleshooting) for common issues.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- 📖 [Documentation](./SETUP.md)
- 🐛 [Report Issues](https://github.com/yourusername/thnkandgrow-fe/issues)
- 💬 [Discussions](https://github.com/yourusername/thnkandgrow-fe/discussions)

## Acknowledgments

- Design inspired by [Apple Newsroom](https://www.apple.com/newsroom/)
- Built with [Next.js](https://nextjs.org) and [WordPress](https://wordpress.org)
- Hosted on [Vercel](https://vercel.com)
