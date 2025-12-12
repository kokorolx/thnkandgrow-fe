# GraphQL Data Caching System

This project uses a local JSON cache to reduce API calls to the backend during build time.

## How It Works

1. **Cache Download**: Run `npm run cache:download` to fetch categories and settings from GraphQL and save to `.cache/graphql-data.json`
2. **Build with Cache**: Use `npm run build:cached` to download fresh cache and then build
3. **Fallback**: If cache is missing or invalid, the app will automatically fall back to GraphQL API calls
4. **Cache Validity**: Cache is considered valid for 24 hours from download time

## Usage

### Option 1: Build with Fresh Cache (Recommended)
```bash
npm run build:cached
```
This will:
1. Download latest data from GraphQL API
2. Save to `.cache/graphql-data.json`
3. Build Next.js with cached data

### Option 2: Manual Cache Download
```bash
npm run cache:download
npm run build
```

### Option 3: Standard Build (Uses Existing Cache or Falls Back to API)
```bash
npm run build
```

## Cache File Structure

The cache file (`.cache/graphql-data.json`) contains:
```json
{
  "timestamp": 1702000000000,
  "categories": [...],
  "settings": {...},
  "posts": [...],
  "tags": [...],
  "authors": [...],
  "postSlugs": [...]
}
```

### Cached Data Types

| Data Type | Description | Usage |
|-----------|-------------|-------|
| `categories` | All blog categories | Navigation, filtering |
| `settings` | Site-wide settings (title, description, etc.) | Header, metadata |
| `posts` | Up to 100 recent posts | Homepage, archives |
| `tags` | All post tags | Tag pages, filtering |
| `authors` | All authors/users | Author pages, post metadata |
| `postSlugs` | All post slugs for static generation | NextJS `generateStaticParams` |

## Automatic Fallback

If the cache is:
- Missing
- Invalid (older than 24 hours)
- Corrupted

The application will automatically fall back to making live GraphQL API calls.

## Environment Variables

The caching system uses the same environment variables as the main application:
- `WORDPRESS_GRAPHQL_ENDPOINT`
- `WORDPRESS_AUTH_TOKEN` (if required)

See `.env.local` or `.env.example` for more details.

## Benefits

✅ Reduces API load during build  
✅ Faster build times (no network delay)  
✅ More resilient (works if backend is temporarily down)  
✅ Automatic fallback if cache fails  
✅ Cache expires after 24 hours for freshness  

## Troubleshooting

If cache download fails:
1. Check that backend API is accessible
2. Verify environment variables are set correctly
3. Check network connectivity
4. Try: `npm run cache:download` to see detailed error messages

If build uses API instead of cache:
1. Check `.cache/graphql-data.json` exists and is readable
2. Check that cached data has valid structure
3. Check `console.log` output - should show `📦 Using cached GraphQL data` if cache is used
