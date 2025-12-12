# Retry Logic Documentation

The cache download script includes automatic retry logic to handle temporary API failures.

## Retry Strategy

The script uses **exponential backoff** to retry failed requests:

### Configuration

```
Max Attempts: 5
Initial Delay: 1 second
Max Delay: 30 seconds
Backoff Multiplier: 2x
```

### Retry Delays

| Attempt | Delay | Total Time |
|---------|-------|------------|
| 1st attempt | (immediate) | 0s |
| 2nd attempt | 1s delay | 1s |
| 3rd attempt | 2s delay | 3s |
| 4th attempt | 4s delay | 7s |
| 5th attempt | 8s delay | 15s |
| 6th attempt (final) | Failed | 15s+ |

## How It Works

1. **First Attempt**: Script tries to fetch data immediately
2. **On Failure**: Script waits for calculated delay, then retries
3. **Exponential Backoff**: Delay doubles with each attempt (1s → 2s → 4s → 8s)
4. **Max Delay Cap**: Delays never exceed 30 seconds
5. **Max Attempts**: After 5 attempts, script fails with detailed error

## Example Output

### Successful After 1st Attempt
```
📥 Caching GraphQL data...
  - Fetching categories...
    ✅ 25 categories fetched
  - Fetching settings...
    ✅ Settings fetched
  ...
✅ GraphQL data cached successfully
```

### Failed Then Succeeded
```
📥 Caching GraphQL data...
  - Fetching categories...
  ⚠️  fetch categories failed (attempt 1/5): Connection refused
     Retrying in 1s...
  [waits 1 second]
  ⚠️  fetch categories failed (attempt 2/5): Connection refused
     Retrying in 2s...
  [waits 2 seconds]
    ✅ 25 categories fetched
  - Fetching settings...
    ✅ Settings fetched
  ...
✅ GraphQL data cached successfully
```

### Permanent Failure
```
📥 Caching GraphQL data...
  - Fetching categories...
  ⚠️  fetch categories failed (attempt 1/5): Connection refused
     Retrying in 1s...
  [... retries 2-5 ...]
  ⚠️  fetch categories failed (attempt 5/5): Connection refused

❌ Error caching GraphQL data: Failed to fetch categories after 5 attempts: Connection refused
```

## When Retries Are Useful

✅ **Temporary network issues** - Network hiccup recovers within seconds
✅ **API Rate Limiting** - Server temporarily overloaded, recovers
✅ **Brief Maintenance** - Backend temporarily down for quick restart
✅ **Timeout Issues** - Slow network recovers with retry

## When Retries Won't Help

❌ **Authentication Errors** - Invalid credentials (won't change on retry)
❌ **GraphQL Syntax Errors** - Malformed queries (won't change on retry)
❌ **Permanent Server Down** - Infrastructure failure (would exceed max retries)

## Customizing Retry Config

Edit `scripts/cache-graphql-data.ts`:

```typescript
const RETRY_CONFIG = {
  maxAttempts: 5,           // Increase for more resilient
  initialDelayMs: 1000,     // Start delay (1 second)
  maxDelayMs: 30000,        // Cap delay at 30 seconds
  backoffMultiplier: 2,     // Double delay each time
};
```

### Examples

**More Aggressive (faster failure)**:
```typescript
maxAttempts: 3,
initialDelayMs: 500,
maxDelayMs: 5000,
```

**More Patient (longer waits)**:
```typescript
maxAttempts: 10,
initialDelayMs: 2000,
maxDelayMs: 60000,
backoffMultiplier: 1.5,
```

## Monitoring Retries

When running `npm run cache:download`:

- **⚠️ warnings** = Attempt failed, retrying
- **✅ checkmarks** = Data fetched successfully
- **❌ error** = All retries exhausted, cache download failed

## CI/CD Considerations

For automated builds:

1. **GitHub Actions**: Set longer job timeout (e.g., 5 minutes)
   ```yaml
   jobs:
     build:
       timeout-minutes: 5
   ```

2. **Vercel/Netlify**: These already have generous timeouts
   
3. **Docker**: Ensure backend service is healthy before build

## Fallback Behavior

If cache download fails but you still need to build:

```bash
# Build without fresh cache (uses existing cache or falls back to API)
npm run build
```

The header and other components will automatically fall back to live GraphQL calls if:
- Cache file is missing
- Cache is older than 24 hours
- Cache file is corrupted
