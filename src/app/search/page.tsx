import { getApolloClient } from '@/lib/apollo';
import { SEARCH_POSTS } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import Search from '@/components/Search';
import { Suspense } from 'react';
import { calculateReadingTime } from '@/lib/utils';
import styles from './page.module.css';

export const metadata = {
  title: 'Search - Newsroom',
  description: 'Search for posts on Newsroom',
};

async function SearchResults({ query }: { query: string }) {
  if (!query) return null;

  const client = getApolloClient();
  let posts = [];

  try {
    const { data } = await client.query({
      query: SEARCH_POSTS,
      variables: { search: query },
    }) as any;
    posts = data?.posts?.nodes || [];
  } catch (error) {
    console.error('Error searching posts:', error);
    // Mock data for search if API fails
    if (query.toLowerCase().includes('mock') || query.toLowerCase().includes('ai')) {
      posts = [
        {
          id: '1',
          title: 'Mock Post: The Future of AI',
          slug: 'mock-post-ai',
          excerpt: '<p>This is a mock post because the API token is expired. The future of AI is bright...</p>',
          date: new Date().toISOString(),
          author: { node: { name: 'Admin', slug: 'admin', avatar: { url: 'https://secure.gravatar.com/avatar/e73790b748301857d283525506f68654?s=96&d=mm&r=g' } } },
          featuredImage: { node: { sourceUrl: 'https://blog.thnkandgrow.com/wp-content/uploads/2023/10/ai-future.jpg' } },
          content: 'This is the content of the mock post about AI. It is quite long to test reading time calculation.',
          categories: { nodes: [{ name: 'Technology', slug: 'technology' }] }
        }
      ];
    }
  }

  if (posts.length === 0) {
    return (
      <div className={styles.noResults}>
        <p className={styles.noResultsText}>No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {posts.map((post: any) => (
        <PostCard
          key={post.id}
          title={post.title}
          excerpt={post.excerpt}
          slug={post.slug}
          date={post.date}
          author={{
            name: post.author?.node?.name || 'Author',
            slug: post.author?.node?.slug,
            avatar: post.author?.node?.avatar?.url,
          }}
          coverImage={post.featuredImage?.node?.sourceUrl}
          category={post.categories?.nodes?.[0]?.name}
          categorySlug={post.categories?.nodes?.[0]?.slug}
          readingTime={calculateReadingTime(post.content || '')}
        />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';

  return (
    <div className="animate-fade-in">
      {/* Search Header */}
      <section className={styles.container}>
        <div className={styles.searchHeader}>
          <h1 className={styles.pageTitle}>Search</h1>
          <Suspense fallback={<div className="text-center">Loading search...</div>}>
            <Search />
          </Suspense>
          <div className={styles.quickLinks}>
            <h3 className={styles.quickLinksTitle}>Quick Links</h3>
            <div className={styles.tagsWrapper}>
              {['Technology', 'Growth', 'Life', 'Apple', 'Design'].map((tag) => (
                <a
                  key={tag}
                  href={`/search?q=${tag}`}
                  className={styles.tagLink}
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {query && (
        <section className={`${styles.container} ${styles.resultsSection}`}>
          <h2 className={styles.resultsTitle}>Results for "{query}"</h2>
          <Suspense fallback={<div className="text-center py-10">Searching...</div>}>
            <SearchResults query={query} />
          </Suspense>
        </section>
      )}
    </div>
  );
}
