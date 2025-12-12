import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getApolloClient } from '../src/lib/apollo.ts';
import {
  GET_CATEGORIES,
  GET_GENERAL_SETTINGS,
  GET_ALL_POSTS,
  GET_TAGS,
  GET_USERS,
  GET_ALL_POST_SLUGS,
} from '../src/lib/queries.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '..', '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'graphql-data.json');

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 5,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

/**
 * Retry a function with exponential backoff
 */
async function withRetry(fn, label) {
  let lastError = null;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === RETRY_CONFIG.maxAttempts) {
        break;
      }

      const delayMs = Math.min(
        RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1),
        RETRY_CONFIG.maxDelayMs
      );

      console.warn(
        `  ⚠️  ${label} failed (attempt ${attempt}/${RETRY_CONFIG.maxAttempts}): ${error?.message || error}`
      );
      console.log(`     Retrying in ${Math.round(delayMs / 1000)}s...`);

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    `Failed to ${label} after ${RETRY_CONFIG.maxAttempts} attempts: ${lastError?.message}`
  );
}

async function cacheGraphQLData() {
  try {
    console.log('📥 Caching GraphQL data...');
    
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const client = getApolloClient();
    const cacheData = {
      timestamp: Date.now(),
    };

    // Fetch all data with retry logic
    console.log('  - Fetching categories...');
    const categoriesData = await withRetry(
      () => client.query({ query: GET_CATEGORIES }),
      'fetch categories'
    );
    cacheData.categories = (categoriesData.data)?.categories?.nodes || [];
    console.log(`    ✅ ${cacheData.categories.length} categories fetched`);

    console.log('  - Fetching settings...');
    const settingsData = await withRetry(
      () => client.query({ query: GET_GENERAL_SETTINGS }),
      'fetch settings'
    );
    cacheData.settings = (settingsData.data)?.generalSettings || {};
    console.log(`    ✅ Settings fetched`);

    console.log('  - Fetching posts...');
    const postsData = await withRetry(
      () => client.query({
        query: GET_ALL_POSTS,
        variables: { first: 100 },
      }),
      'fetch posts'
    );
    cacheData.posts = (postsData.data)?.posts?.nodes || [];
    console.log(`    ✅ ${cacheData.posts.length} posts fetched`);

    console.log('  - Fetching tags...');
    const tagsData = await withRetry(
      () => client.query({ query: GET_TAGS }),
      'fetch tags'
    );
    cacheData.tags = (tagsData.data)?.tags?.nodes || [];
    console.log(`    ✅ ${cacheData.tags.length} tags fetched`);

    console.log('  - Fetching authors/users...');
    const usersData = await withRetry(
      () => client.query({ query: GET_USERS }),
      'fetch authors'
    );
    cacheData.authors = (usersData.data)?.users?.nodes || [];
    console.log(`    ✅ ${cacheData.authors.length} authors fetched`);

    console.log('  - Fetching post slugs...');
    const slugsData = await withRetry(
      () => client.query({
        query: GET_ALL_POST_SLUGS,
        variables: { first: 100 },
      }),
      'fetch post slugs'
    );
    cacheData.postSlugs = (slugsData.data)?.posts?.nodes || [];
    console.log(`    ✅ ${cacheData.postSlugs.length} post slugs fetched`);

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    
    console.log(`\n✅ GraphQL data cached successfully at ${CACHE_FILE}`);
    console.log(`   📦 Data cached:`);
    console.log(`      - ${cacheData.categories?.length || 0} categories`);
    console.log(`      - ${cacheData.posts?.length || 0} posts`);
    console.log(`      - ${cacheData.tags?.length || 0} tags`);
    console.log(`      - ${cacheData.authors?.length || 0} authors`);
    console.log(`      - ${cacheData.postSlugs?.length || 0} post slugs`);
    console.log(`   ⏰ Cached at ${new Date(cacheData.timestamp).toISOString()}`);
  } catch (error) {
    console.error('❌ Error caching GraphQL data:', error);
    process.exit(1);
  }
}

cacheGraphQLData();
