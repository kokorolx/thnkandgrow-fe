import { getApolloClient } from '@/lib/apollo';
import { GET_POSTS_BY_CATEGORY, GET_CATEGORIES } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';
import { calculateReadingTime } from '@/lib/utils';
import type { Metadata } from 'next';
import styles from '../../archive.module.css';

// Revalidate every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const client = getApolloClient();

  try {
    const { data } = await client.query({
      query: GET_CATEGORIES,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }
        }
      }
    }) as any;

    return data?.categories?.nodes?.map((category: any) => ({
      slug: category.slug,
    })) ?? [];
  } catch (error) {
    console.error('Error fetching category slugs for static generation:', error);
    // Return empty array on error to allow build to continue
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_CATEGORY,
      variables: { slug },
    }) as any;

    const category = data?.category;

    if (!category) {
      return {
        title: 'Category Not Found',
      };
    }

    const title = category.seo?.title || `${category.name} - Category`;
    const description = category.seo?.metaDesc || category.description || `Browse all posts in ${category.name}`;
    const url = `https://blog.thnkandgrow.com/category/${slug}`;

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
      title: 'Category Archive',
    };
  }
}

async function getCategoryPosts(slug: string) {
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_CATEGORY,
      variables: { slug },
    }) as any;
    return {
      category: data?.category,
      posts: data?.category?.posts?.nodes || [],
    };
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return null;
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryPosts(slug);

  if (!data || !data.category) {
    notFound();
  }

  const { category, posts } = data;

  return (
    <div className="animate-fade-in">
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
                category={category.name}
                categorySlug={category.slug}
                readingTime={calculateReadingTime(post.content || '')}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No posts found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
