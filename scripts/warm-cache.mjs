#!/usr/bin/env node

/**
 * Cache Warming Script
 *
 * This script pre-generates all ISR pages by visiting them sequentially.
 * It fetches all slugs from the GraphQL API and makes HTTP requests to each page.
 *
 * Usage:
 *   node scripts/warm-cache.mjs [base-url]
 *
 * Example:
 *   node scripts/warm-cache.mjs http://localhost:3000
 *   node scripts/warm-cache.mjs https://blog.thnkandgrow.com
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const GRAPHQL_ENDPOINT = process.env.WORDPRESS_API_URL || 'https://blog.thnkandgrow.com/graphql';
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay between requests

// GraphQL queries
const GET_ALL_SLUGS = `
  query GetAllSlugs {
  posts(first: 1000) {
      nodes {
      slug
    }
  }
  categories(first: 100) {
      nodes {
      slug
    }
  }
  tags(first: 100) {
      nodes {
      slug
    }
  }
  users(first: 100) {
      nodes {
      slug
    }
  }
}
`;

// Utility function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all slugs from GraphQL
async function fetchAllSlugs() {
  console.log('📡 Fetching all slugs from GraphQL API...\n');

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add authentication if WORDPRESS_AUTH_REFRESH_TOKEN is available
    const authToken = process.env.WORDPRESS_AUTH_REFRESH_TOKEN;
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken} `;
      console.log('🔐 Using authentication token from .env.local\n');
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: GET_ALL_SLUGS }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      console.error('❌ GraphQL errors:', errors);
      throw new Error('Failed to fetch slugs from GraphQL');
    }

    return {
      posts: data.posts?.nodes || [],
      categories: data.categories?.nodes || [],
      tags: data.tags?.nodes || [],
      authors: data.users?.nodes || [],
    };
  } catch (error) {
    console.error('❌ Error fetching slugs:', error.message);
    throw error;
  }
}

// Visit a single page
async function visitPage(url, index, total) {
  const percentage = ((index / total) * 100).toFixed(1);
  process.stdout.write(`[${index}/${total}](${percentage}%) Visiting: ${url} ... `);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Cache-Warmer/1.0',
      },
      timeout: 60000, // 60 second timeout
    });

    const duration = Date.now() - startTime;

    if (response.ok) {
      console.log(`✓ ${response.status} (${duration}ms)`);
      return { success: true, url, status: response.status, duration };
    } else {
      console.log(`✗ ${response.status} (${duration}ms)`);
      return { success: false, url, status: response.status, duration };
    }
  } catch (error) {
    console.log(`✗ ERROR: ${error.message} `);
    return { success: false, url, error: error.message };
  }
}

// Main function
async function warmCache() {
  console.log('🔥 Starting cache warming process...');
  console.log(`📍 Base URL: ${BASE_URL} `);
  console.log(`⏱️  Delay between requests: ${DELAY_BETWEEN_REQUESTS} ms\n`);

  const startTime = Date.now();
  const results = {
    success: [],
    failed: [],
  };

  try {
    // Fetch all slugs
    const { posts, categories, tags, authors } = await fetchAllSlugs();

    console.log(`📊 Found: `);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${tags.length} tags`);
    console.log(`   - ${authors.length} authors`);
    console.log(`   - Total: ${posts.length + categories.length + tags.length + authors.length} pages\n`);

    // Build list of URLs to visit
    const urls = [
      BASE_URL, // Homepage
      ...posts.map(p => `${BASE_URL} /posts/${p.slug} `),
      ...categories.map(c => `${BASE_URL} /category/${c.slug} `),
      ...tags.map(t => `${BASE_URL} /tag/${t.slug} `),
      ...authors.map(a => `${BASE_URL} /author/${a.slug} `),
    ];

    console.log(`\n🚀 Starting sequential page visits...\n`);

    // Visit each page sequentially
    for (let i = 0; i < urls.length; i++) {
      const result = await visitPage(urls[i], i + 1, urls.length);

      if (result.success) {
        results.success.push(result);
      } else {
        results.failed.push(result);
      }

      // Wait before next request (except for the last one)
      if (i < urls.length - 1) {
        await sleep(DELAY_BETWEEN_REQUESTS);
      }
    }

    // Summary
    const totalTime = Date.now() - startTime;
    const avgTime = results.success.reduce((sum, r) => sum + (r.duration || 0), 0) / results.success.length;

    console.log(`\n${'='.repeat(60)} `);
    console.log('📈 SUMMARY');
    console.log(`${'='.repeat(60)} `);
    console.log(`✓ Successful: ${results.success.length} `);
    console.log(`✗ Failed: ${results.failed.length} `);
    console.log(`⏱️  Total time: ${(totalTime / 1000).toFixed(1)} s`);
    console.log(`⚡ Average response time: ${avgTime.toFixed(0)} ms`);

    if (results.failed.length > 0) {
      console.log(`\n❌ Failed URLs: `);
      results.failed.forEach(r => {
        console.log(`   - ${r.url} (${r.status || r.error})`);
      });
    }

    console.log(`\n✅ Cache warming complete!\n`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
warmCache().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
