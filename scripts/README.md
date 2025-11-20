# Cache Warming Script

This script pre-generates all ISR (Incremental Static Regeneration) pages by visiting them sequentially. It's useful for warming up the cache after deployment or when you want to ensure all pages are pre-rendered.

## Usage

### Option 1: Run directly
```bash
node scripts/warm-cache.mjs [base-url]
```

### Option 2: Use npm script
```bash
# Warm cache for local development
npm run warm-cache http://localhost:3000

# Warm cache for production
npm run warm-cache https://blog.thnkandgrow.com
```

### Option 3: Build and warm in one command
```bash
npm run build:warm
```

## What it does

1. Fetches all slugs from your GraphQL API:
   - Posts
   - Categories
   - Tags
   - Authors

2. Visits each page sequentially with a 1-second delay between requests

3. Shows real-time progress with:
   - Current page being visited
   - Success/failure status
   - Response time for each page
   - Overall progress percentage

4. Provides a summary at the end:
   - Total pages visited
   - Success/failure count
   - Total time taken
   - Average response time
   - List of failed URLs (if any)

## Example Output

```
🔥 Starting cache warming process...
📍 Base URL: http://localhost:3000
⏱️  Delay between requests: 1000ms

📡 Fetching all slugs from GraphQL API...

📊 Found:
   - 239 posts
   - 15 categories
   - 42 tags
   - 3 authors
   - Total: 299 pages

🚀 Starting sequential page visits...

[1/299] (0.3%) Visiting: http://localhost:3000 ... ✓ 200 (1234ms)
[2/299] (0.7%) Visiting: http://localhost:3000/posts/my-first-post ... ✓ 200 (2345ms)
...

============================================================
📈 SUMMARY
============================================================
✓ Successful: 295
✗ Failed: 4
⏱️  Total time: 320.5s
⚡ Average response time: 1850ms

✅ Cache warming complete!
```

## Configuration

You can modify the delay between requests by editing the `DELAY_BETWEEN_REQUESTS` constant in `scripts/warm-cache.mjs`:

```javascript
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second (default)
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds (more gentle on backend)
const DELAY_BETWEEN_REQUESTS = 500;  // 0.5 seconds (faster, but more load)
```

## When to use

- **After deployment**: Warm the cache so first visitors get fast page loads
- **Before traffic spikes**: Pre-generate pages before expected high traffic
- **After content updates**: Refresh the cache after bulk content changes
- **Testing**: Verify all pages render correctly
