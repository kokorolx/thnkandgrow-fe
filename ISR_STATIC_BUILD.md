# ISR & Static Build Configuration

## Overview
Successfully configured the Next.js application to use Incremental Static Regeneration (ISR) and static generation for optimal performance.

## Configuration Changes

### next.config.ts
- **output**: `'standalone'` - Generates standalone build suitable for Docker/production deployment
- **images**: Configured remote pattern support for external image optimization
- **compress**: Enabled for smaller bundle sizes

### Page-Level Configurations

#### Static Pages (revalidate weekly - 604800 seconds)
- `/about` - About page
- `/contact` - Contact page  
- `/portfolio` - Portfolio listing
- All static pages marked with `export const dynamic = 'force-static'`

#### Dynamic Pages with ISR (revalidate daily - 86400 seconds)
- `/portfolio/[slug]` - Individual portfolio items

#### SSG Pages with Fallback (revalidate weekly - 604800 seconds)
- `/posts/[slug]` - Blog posts with on-demand generation
- `/category/[slug]` - Category archives with dynamic params
- `/tag/[slug]` - Tag archives with dynamic params
- Uses `generateStaticParams()` for initial generation
- Uses `dynamicParams = true` for on-demand generation

#### Homepage (revalidate every 3 days - 259200 seconds)
- `/` - Homepage with cached GraphQL data
- `export const dynamic = 'force-static'` ensures static generation

## Build Output

### Route Types
- **○ (Static)**: Prerendered as static content (About, Contact, Portfolio, Robots, Sitemap)
- **● (SSG)**: Prerendered as static HTML using generateStaticParams (Posts, Categories, Tags, Authors)
- **ƒ (Dynamic)**: Server-rendered on demand (API routes, Search)

### Generated Pages
- 242 total pregenerated pages
- Static pages: ~100 tag pages, ~25 category pages, ~100 post pages, 2 portfolio items
- All pages cached with appropriate revalidation windows

## Client Components

### Dynamic Imports (ssr: false)
- `TextToSpeechWrapper` - Wraps TextToSpeechReader for client-side rendering
- ShareButtons - Client component for social sharing with window location

### Implementation Details
- Created `src/components/TextToSpeechWrapper.tsx` - Client wrapper for TTS component
- Created `src/components/ShareButtons.tsx` - Client component for social sharing
- Both use dynamic imports with `ssr: false` to prevent hydration mismatches

## Build Scripts

```bash
# Standard build (recommended for production)
npm run build

# Standalone build (for Docker/containerized deployment)
npm run build:standalone

# Static generation with experimental flag
npm run build:static

# Start server (port 9999)
npm start

# Start standalone server
npm run start:standalone
```

## Performance Benefits

1. **Static Generation**: Fast page loads for cached content
2. **ISR**: Background revalidation without blocking requests
3. **Standalone Output**: Optimized for production deployment
4. **Image Optimization**: Next.js automatic image optimization for remote sources
5. **Compression**: Built-in gzip compression for smaller transfers

## Deployment

The `output: 'standalone'` configuration generates a self-contained build in `.next/standalone/`:

```bash
# Docker-ready output
.next/standalone/server.js  # Standalone server
.next/static/                # Static assets
public/                      # Public files
```

## Caching Strategy

| Route | Revalidation | Type |
|-------|-------------|------|
| `/` | 3 days | Static (force-static) |
| `/about` | 1 week | Static (force-static) |
| `/contact` | 1 week | Static (force-static) |
| `/portfolio` | 1 week | Static (force-static) |
| `/portfolio/[slug]` | 1 day | SSG with ISR |
| `/posts/[slug]` | 1 week | SSG with ISR + on-demand |
| `/category/[slug]` | 1 week | SSG with ISR + on-demand |
| `/tag/[slug]` | 1 week | SSG with ISR + on-demand |
| `/api/*` | N/A | Dynamic |

## Troubleshooting

### Client Component Issues
If you see "Event handlers cannot be passed to Client Component props" errors:
1. Extract interactive components to separate client components
2. Use dynamic imports with `ssr: false` for client-only components
3. Wrap client components in their own module

### Window/Document Not Defined
For components needing browser APIs:
1. Mark component with `'use client'`
2. Use `useEffect` with `typeof window !== 'undefined'` checks
3. Delay rendering until hydration complete with conditional returns

## Future Optimizations

- Monitor revalidation timing and adjust if needed
- Consider using On-Demand Revalidation via API routes
- Implement edge caching with CDN
- Add Incremental Static Regeneration (ISR) for user-generated content
