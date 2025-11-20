'use client';

import { useState } from 'react';
import { getApolloClient } from '@/lib/apollo';
import { GET_POSTS_BY_AUTHOR } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import { calculateReadingTime } from '@/lib/utils';
import styles from './LoadMoreButton.module.css';

interface LoadMoreProps {
  authorSlug: string;
  authorName: string;
  authorAvatar?: string;
  initialPosts: any[];
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
}

export default function LoadMore({
  authorSlug,
  authorName,
  authorAvatar,
  initialPosts,
  initialHasNextPage,
  initialEndCursor,
}: LoadMoreProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    try {
      const client = getApolloClient();
      const { data } = await client.query({
        query: GET_POSTS_BY_AUTHOR,
        variables: {
          slug: authorSlug,
          first: 10,
          after: endCursor,
        },
      }) as any;

      const newPosts = data?.user?.posts?.nodes || [];
      const pageInfo = data?.user?.posts?.pageInfo;

      setPosts([...posts, ...newPosts]);
      setHasNextPage(pageInfo?.hasNextPage || false);
      setEndCursor(pageInfo?.endCursor || null);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {posts.map((post: any) => (
        <PostCard
          key={post.id}
          title={post.title}
          excerpt={post.excerpt}
          slug={post.slug}
          date={post.date}
          author={{
            name: authorName,
            slug: authorSlug,
            avatar: authorAvatar,
          }}
          coverImage={post.featuredImage?.node?.sourceUrl}
          category={post.categories?.nodes[0]?.name}
          categorySlug={post.categories?.nodes[0]?.slug}
          readingTime={calculateReadingTime(post.content || '')}
        />
      ))}

      {hasNextPage && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={loadMore}
            disabled={loading}
            className={styles.loadMoreButton}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}
