# Cache Usage in Components

## Importing Cache Functions

```typescript
import {
  getCachedData,
  getCachedCategories,
  getCachedSettings,
  getCachedPosts,
  getCachedTags,
  getCachedAuthors,
  getCachedPostSlugs,
  isCacheValid,
} from '@/lib/cache';
```

## Example: Using Cache in a Component

```typescript
// Fetch with cache fallback
import { getApolloClient } from '@/lib/apollo';
import { getCachedPosts, isCacheValid } from '@/lib/cache';
import { GET_ALL_POSTS } from '@/lib/queries';

export default async function HomePage() {
  let posts = [];

  // Try cache first
  if (isCacheValid()) {
    posts = getCachedPosts();
    console.log('📦 Using cached posts');
  } else {
    // Fallback to GraphQL
    try {
      const client = getApolloClient();
      const { data } = await client.query({
        query: GET_ALL_POSTS,
        variables: { first: 10 }
      });
      posts = data?.posts?.nodes || [];
      console.log('🔄 Fetching posts from API');
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Cache Helper Functions

### `getCachedData(): CachedData | null`
Returns entire cached object or null if not available.

### `getCachedCategories(): any[]`
Returns cached categories array.

### `getCachedSettings(): any`
Returns cached site settings object.

### `getCachedPosts(): any[]`
Returns cached posts array.

### `getCachedTags(): any[]`
Returns cached tags array.

### `getCachedAuthors(): any[]`
Returns cached authors/users array.

### `getCachedPostSlugs(): any[]`
Returns cached post slugs (useful for `generateStaticParams`).

### `isCacheValid(): boolean`
Returns true if cache exists and is less than 24 hours old.

## Best Practices

1. **Always check cache validity before using**:
   ```typescript
   if (isCacheValid()) {
     const data = getCachedPosts();
   }
   ```

2. **Always have a fallback to GraphQL**:
   ```typescript
   let data = [];
   if (isCacheValid()) {
     data = getCachedPosts();
   } else {
     // Fetch from API
   }
   ```

3. **Use specific getter functions** instead of accessing raw cached data:
   ```typescript
   // ✅ Good
   const posts = getCachedPosts();
   
   // ❌ Avoid
   const posts = getCachedData()?.posts;
   ```

4. **Cache expires after 24 hours** - if you need fresher data, run `npm run cache:download`

## For Static Generation

Use cached post slugs in `generateStaticParams`:

```typescript
export async function generateStaticParams() {
  const slugs = getCachedPostSlugs();
  
  if (!slugs.length) {
    // Fallback to API if cache is empty
    const client = getApolloClient();
    const { data } = await client.query({ query: GET_ALL_POST_SLUGS });
    return (data?.posts?.nodes || []).map(post => ({ slug: post.slug }));
  }
  
  return slugs.map(post => ({ slug: post.slug }));
}
```

## Commands

```bash
# Download cache before build
npm run cache:download

# Build with fresh cache
npm run build:cached

# Regular build (uses cache if available)
npm run build

# Clear cache
rm -rf .cache
```
