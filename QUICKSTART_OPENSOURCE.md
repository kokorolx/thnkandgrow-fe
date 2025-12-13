# Quick Start for Open Source Contributors

## For New Contributors

### 1. Clone & Setup (2 minutes)
```bash
git clone https://github.com/yourusername/thnkandgrow-fe.git
cd thnkandgrow-fe
npm install
```

### 2. Configure Environment (1 minute)
```bash
cp .env.example .env.local
# Edit .env.local with your WordPress site details
```

### 3. Run Development Server (instant)
```bash
npm run dev
```
Open http://localhost:9999

## Environment Variables Needed

```env
# Your WordPress GraphQL endpoint
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql

# Your site's domain
NEXT_PUBLIC_BASE_URL=https://your-blog-domain.com

# Optional: If your WordPress requires authentication
WORDPRESS_AUTH_REFRESH_TOKEN=your_refresh_token

# Optional: CloudFront CDN domain
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=your-cdn.cloudfront.net
```

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality
npm start            # Start production server
npm run cache:download  # Download content for caching
```

## File Locations

- **Components**: `src/components/`
- **Pages**: `src/app/`
- **GraphQL Queries**: `src/lib/queries.ts`
- **Styles**: `src/components/**/*.module.css`
- **API Routes**: `src/app/api/`

## Making Changes

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Run linting: `npm run lint`
4. Commit: `git commit -m "feat: description of change"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## Need Help?

- 📖 [Full Setup Guide](./SETUP.md)
- 📝 [Contributing Guidelines](./CONTRIBUTING.md)
- 🐛 [Report Issues](https://github.com/yourusername/thnkandgrow-fe/issues)

## Key Technologies

- **Next.js 16** - React framework
- **WordPress + GraphQL** - Headless CMS
- **TypeScript** - Type safety
- **Apollo Client** - GraphQL client

That's it! You're ready to contribute. Happy coding! 🚀
