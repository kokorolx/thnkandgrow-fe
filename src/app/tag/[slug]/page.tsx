import { getApolloClient } from '@/lib/apollo';
import { GET_POSTS_BY_TAG, GET_TAGS } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';
import { calculateReadingTime } from '@/lib/utils';
import type { Metadata } from 'next';
import styles from '../../archive.module.css';

// ISR: Generate static pages with revalidation every 7 days
export const revalidate = 604800;

// Use static generation with ISR fallback
export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const client = getApolloClient();

  try {
    const { data } = await client.query({
      query: GET_TAGS,
      variables: { first: 100 },
      context: {
        fetchOptions: {
          next: { revalidate: 604800 }
        }
      }
    }) as any;

    return data?.tags?.nodes?.map((tag: any) => ({
      slug: tag.slug,
    })) ?? [];
  } catch (error) {
    console.error('Error fetching tag slugs for static generation:', error);
    // Return empty array on error to allow build to continue
    return [];
  }
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_TAG,
      variables: { slug },
    }) as any;

    const tag = data?.tag;

    if (!tag) {
      return {
        title: 'Tag Not Found',
      };
    }

    const title = tag.seo?.title || `${tag.name} - Tag`;
    const description = tag.seo?.metaDesc || tag.description || `Browse all posts tagged with ${tag.name}`;
    const url = `https://blog.thnkandgrow.com/tag/${slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: 'Tag Archive',
    };
  }
}

async function getTagPosts(slug: string) {
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_TAG,
      variables: { slug },
    }) as any;
    return {
      tag: data?.tag,
      posts: data?.tag?.posts?.nodes || [],
    };
  } catch (error) {
    console.error('Error fetching tag posts:', error);
    return null;
  }
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getTagPosts(slug);

  if (!data || !data.tag) {
    notFound();
  }

  const { tag, posts } = data;

  return (
    <div className="animate-fade-in">
      {/* Tag Header */}
      <section className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Tag</span>
          <h1 className={styles.title}>{tag.name}</h1>
          {tag.description && (
            <p className={styles.description}>{tag.description}</p>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className={`${styles.container} ${styles.gridSection}`}>
        {posts.length > 0 ? (
          <div className={styles.grid}>
            {posts.map((post: any) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                slug={post.slug}
                date={post.date}
                author={{
                  name: post.author.node.name,
                  slug: post.author.node.slug,
                  avatar: post.author.node.avatar?.url
                }}
                coverImage={post.featuredImage?.node?.sourceUrl}
                category={post.categories?.nodes[0]?.name}
                categorySlug={post.categories?.nodes[0]?.slug}
                readingTime={calculateReadingTime(post.content || '')}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No posts found for this tag.</p>
          </div>
        )}
      </section>
    </div>
  );
}
