import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { getApolloClient } from '../src/lib/apollo';
import {
  GET_CATEGORIES,
  GET_GENERAL_SETTINGS,
  GET_ALL_POSTS,
  GET_TAGS,
  GET_USERS,
  GET_ALL_POST_SLUGS,
} from '../src/lib/queries';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'graphql-data.json');

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 100,
  initialDelayMs: 1000,
  maxDelayMs: 60000,
  backoffMultiplier: 2,
};

interface CachedData {
  timestamp: number;
  categories: any[];
  settings: any;
  posts: any[];
  tags: any[];
  authors: any[];
  postSlugs: any[];
}

/**
 * Retry a function with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === RETRY_CONFIG.maxAttempts) {
        break; // Don't delay after final attempt
      }

      // Calculate delay with exponential backoff
      const delayMs = Math.min(
        RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1),
        RETRY_CONFIG.maxDelayMs
      );

      console.warn(
        `  ⚠️  ${label} failed (attempt ${attempt}/${RETRY_CONFIG.maxAttempts}): ${
          (error as any)?.message || error
        }`
      );
      console.log(`     Retrying in ${Math.round(delayMs / 1000)}s...`);

      // Wait before retrying
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

    // Create cache directory if it doesn't exist
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const client = getApolloClient();
    const cacheData = {
      timestamp: Date.now(),
      categories: [] as any[],
      settings: {} as any,
      posts: [] as any[],
      tags: [] as any[],
      authors: [] as any[],
      postSlugs: [] as any[],
    };

    // Fetch all data with retry logic
    console.log('  - Fetching categories...');
    const categoriesData = await withRetry(
      () => client.query({ query: GET_CATEGORIES }),
      'fetch categories'
    );
    cacheData.categories = (categoriesData.data as any)?.categories?.nodes || [];
    console.log(`    ✅ ${cacheData.categories.length} categories fetched`);
    cacheData.categories.slice(0, 10).forEach(cat => {
      console.log(`       - ${cat.slug || cat.name}`);
    });
    if (cacheData.categories.length > 10) {
      console.log(`       ... and ${cacheData.categories.length - 10} more`);
    }

    console.log('  - Fetching settings...');
    const settingsData = await withRetry(
      () => client.query({ query: GET_GENERAL_SETTINGS }),
      'fetch settings'
    );
    cacheData.settings = (settingsData.data as any)?.generalSettings || {};
    console.log(`    ✅ Settings fetched`);

    console.log('  - Fetching posts...');
    const postsData = await withRetry(
      () => client.query({
        query: GET_ALL_POSTS,
        variables: { first: 100 },
      }),
      'fetch posts'
    );
    cacheData.posts = (postsData.data as any)?.posts?.nodes || [];
    console.log(`    ✅ ${cacheData.posts.length} posts fetched`);
    cacheData.posts.slice(0, 10).forEach(post => {
      console.log(`       - ${post.title || post.slug}`);
    });
    if (cacheData.posts.length > 10) {
      console.log(`       ... and ${cacheData.posts.length - 10} more`);
    }

    console.log('  - Fetching tags...');
    const tagsData = await withRetry(
      () => client.query({ query: GET_TAGS }),
      'fetch tags'
    );
    cacheData.tags = (tagsData.data as any)?.tags?.nodes || [];
    console.log(`    ✅ ${cacheData.tags.length} tags fetched`);
    cacheData.tags.slice(0, 10).forEach(tag => {
      console.log(`       - ${tag.slug || tag.name}`);
    });
    if (cacheData.tags.length > 10) {
      console.log(`       ... and ${cacheData.tags.length - 10} more`);
    }

    console.log('  - Fetching authors/users...');
    const usersData = await withRetry(
      () => client.query({ query: GET_USERS }),
      'fetch authors'
    );
    cacheData.authors = (usersData.data as any)?.users?.nodes || [];
    console.log(`    ✅ ${cacheData.authors.length} authors fetched`);
    cacheData.authors.slice(0, 10).forEach(author => {
      console.log(`       - ${author.name || author.nicename || author.login}`);
    });
    if (cacheData.authors.length > 10) {
      console.log(`       ... and ${cacheData.authors.length - 10} more`);
    }

    console.log('  - Fetching post slugs...');
    const slugsData = await withRetry(
      () => client.query({
        query: GET_ALL_POST_SLUGS,
        variables: { first: 100 },
      }),
      'fetch post slugs'
    );
    cacheData.postSlugs = (slugsData.data as any)?.posts?.nodes || [];
    console.log(`    ✅ ${cacheData.postSlugs.length} post slugs fetched`);
    cacheData.postSlugs.slice(0, 10).forEach(post => {
      console.log(`       - ${post.slug}`);
    });
    if (cacheData.postSlugs.length > 10) {
      console.log(`       ... and ${cacheData.postSlugs.length - 10} more`);
    }

    // Write to cache file
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));

    console.log(`\n✅ GraphQL data cached successfully at ${CACHE_FILE}`);
    console.log(`   📦 Data cached:`);
    console.log(`      - ${cacheData.categories.length} categories`);
    console.log(`      - ${cacheData.posts.length} posts`);
    console.log(`      - ${cacheData.tags.length} tags`);
    console.log(`      - ${cacheData.authors.length} authors`);
    console.log(`      - ${cacheData.postSlugs.length} post slugs`);
    console.log(`   ⏰ Cached at ${new Date(cacheData.timestamp).toISOString()}`);
  } catch (error) {
    console.error('❌ Error caching GraphQL data:', error);
    process.exit(1);
  }
}

cacheGraphQLData();
