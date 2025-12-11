import { getApolloClient } from '@/lib/apollo';
import { GET_POSTS_BY_AUTHOR, GET_USERS } from '@/lib/queries';
import LoadMore from '@/components/LoadMore';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import styles from '../../archive.module.css';

// Revalidate every 7 days
export const revalidate = 604800;

export async function generateStaticParams() {
  const client = getApolloClient();

  try {
    const { data } = await client.query({
      query: GET_USERS,
      variables: { first: 100 },
      context: {
        fetchOptions: {
          next: { revalidate: 604800 }
        }
      }
    }) as any;

    return data?.users?.nodes?.map((user: any) => ({
      slug: user.slug,
    })) ?? [];
  } catch (error) {
    console.error('Error fetching user slugs for static generation:', error);
    // Return empty array on error to allow build to continue
    return [];
  }
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_AUTHOR,
      variables: { slug },
    }) as any;

    const user = data?.user;

    if (!user) {
      return {
        title: 'Author Not Found',
      };
    }

    const title = `${user.name} - Author`;
    const description = user.description || `Read all posts by ${user.name}`;
    const url = `https://blog.thnkandgrow.com/author/${slug}`;

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
        type: 'profile',
        images: user.avatar?.url ? [
          {
            url: user.avatar.url,
            width: 400,
            height: 400,
            alt: user.name,
          }
        ] : [],
      },
      twitter: {
        card: 'summary',
        title,
        description,
        images: user.avatar?.url ? [user.avatar.url] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Author Archive',
    };
  }
}

async function getAuthorPosts(slug: string) {
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_AUTHOR,
      variables: { slug, first: 10 },
    }) as any;
    return {
      user: data?.user,
      posts: data?.user?.posts?.nodes || [],
      pageInfo: data?.user?.posts?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('Error fetching author posts:', error);
    return null;
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getAuthorPosts(slug);

  if (!data || !data.user) {
    notFound();
  }

  const { user, posts, pageInfo } = data;

  return (
    <div className="animate-fade-in">
      {/* Author Header */}
      <section className={styles.container}>
        <div className={`${styles.header} flex flex-col md:flex-row items-center md:items-start gap-6`}>
          {user.avatar?.url && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border border-[#d2d2d7]">
              <Image
                src={user.avatar.url}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <span className={styles.label}>Author</span>
            <h1 className={styles.title}>{user.name}</h1>
            {user.description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: user.description }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className={`${styles.container} ${styles.gridSection}`}>
        {posts.length > 0 ? (
          <div className={styles.grid}>
            <LoadMore
              authorSlug={user.slug}
              authorName={user.name}
              authorAvatar={user.avatar?.url}
              initialPosts={posts}
              initialHasNextPage={pageInfo.hasNextPage}
              initialEndCursor={pageInfo.endCursor}
            />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No posts found by this author.</p>
          </div>
        )}
      </section>
    </div>
  );
}
