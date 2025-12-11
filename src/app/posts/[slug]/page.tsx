import { getApolloClient } from '@/lib/apollo';
import { GET_POST_BY_SLUG, GET_ALL_POSTS, GET_RECENT_POSTS, GET_ALL_POST_SLUGS } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import PostViewTracker from '@/components/PostViewTracker';
import TextToSpeechReader from '@/components/TextToSpeechReader';
import StructuredData from '@/components/StructuredData';
import { calculateReadingTime } from '@/lib/utils';
import styles from './page.module.css';

// Revalidate every 7 days
export const revalidate = 604800;

// Generate other pages on-demand
export const dynamicParams = true;

export async function generateStaticParams() {
  const client = getApolloClient();

  try {
    const { data } = await client.query({
      query: GET_ALL_POST_SLUGS,
      context: {
        fetchOptions: {
          next: { revalidate: 604800 }
        }
      }
    }) as any;

    return data?.posts?.nodes?.map((post: any) => ({
      slug: post.slug,
    })) ?? [];
  } catch (error) {
    console.error('Error fetching post slugs for static generation:', error);
    // Return empty array on error to allow build to continue
    return [];
  }
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = getApolloClient();

  try {
    const { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
    }) as any;

    const post = data?.post;

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const description = post.seo?.metaDesc || post.excerpt?.replace(/\u003c[^\u003e]*\u003e/g, '').slice(0, 160) || '';
    const canonicalUrl = `/posts/${slug}`;

    return {
      title: post.seo?.title || post.title,
      description: description || 'Read this article on ThnkAndGrow.',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: post.seo?.opengraphTitle || post.title,
        description: post.seo?.opengraphDescription || description || 'Read this article on ThnkAndGrow.',
        url: canonicalUrl,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [post.author?.node?.name || 'ThnkAndGrow'],
        images: post.seo?.opengraphImage?.sourceUrl ? [{ url: post.seo.opengraphImage.sourceUrl }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo?.title || post.title,
        description: description || 'Read this article on ThnkAndGrow.',
        images: post.seo?.opengraphImage?.sourceUrl ? [post.seo.opengraphImage.sourceUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'ThnkAndGrow Blog',
    };
  }
}

async function getPostData(slug: string) {
  const client = getApolloClient();
  try {
    const [postResult, recentPostsResult] = await Promise.all([
      client.query({
        query: GET_POST_BY_SLUG,
        variables: { slug },
      }) as any,
      client.query({
        query: GET_RECENT_POSTS,
        variables: { first: 3 }
      }) as any
    ]);

    return {
      post: postResult.data?.post,
      recentPosts: recentPostsResult.data?.posts?.nodes || []
    };
  } catch (error) {
    console.error('Error fetching post data:', error);
    return { post: null, recentPosts: [] };
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post, recentPosts } = await getPostData(slug);

  if (!post) {
    notFound();
  }

  // Filter out the current post from recent posts
  const relatedPosts = recentPosts.filter((p: any) => p.slug !== slug).slice(0, 3);

  return (
    <div className="animate-fade-in">
      <PostViewTracker postId={post.id} />

      <StructuredData
        type="article"
        article={{
          headline: post.title,
          description: post.excerpt?.replace(/\u003c[^\u003e]*\u003e/g, '').slice(0, 160) || '',
          image: post.featuredImage?.node?.sourceUrl,
          datePublished: post.date,
          dateModified: post.modified,
          author: {
            name: post.author?.node?.name || 'ThnkAndGrow',
          },
        }}
      />

      <article className={styles.post}>
      {/* Article Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.meta}>
            {post.categories?.nodes[0] && (
              <Link href={`/category/${post.categories.nodes[0].slug}`} className={styles.categoryLink}>
                <span className={styles.category}>{post.categories.nodes[0].name}</span>
              </Link>
            )}
            <span className={styles.separator}>•</span>
            <span className={styles.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className={styles.separator}>•</span>
            <span className={styles.readingTime}>{calculateReadingTime(post.content || '')}</span>
          </div>

          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: post.title }} />

          <div className={styles.author}>
            {post.author?.node?.avatar?.url && (
              <div className={styles.authorAvatar}>
                <Image
                  src={post.author.node.avatar.url}
                  alt={post.author.node.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            )}
            <div className={styles.authorInfo}>
              <span className={styles.by}>By</span>
              {post.author?.node?.slug ? (
                <Link href={`/author/${post.author.node.slug}`} className={styles.authorLink}>
                  {post.author.node.name}
                </Link>
              ) : (
                <span className={styles.authorName}>{post.author?.node?.name || 'ThnkAndGrow'}</span>
              )}
            </div>
          </div>
        </div>
      </header>

        {/* Hero Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className={styles.heroImageWrapper}>
             <div className={styles.heroImageContainer}>
               <Image
                 src={post.featuredImage.node.sourceUrl}
                 alt={post.featuredImage.node.altText || post.title}
                 fill
                 className={styles.heroImage}
                 priority
               />
             </div>
          </div>
        )}

        <div className={styles.contentWrapper}>
          {/* Social Share (Optional - Minimal) */}
          <div className={styles.socialShare}>
             {/* Add share buttons here if needed */}
          </div>

          {/* Text-to-Speech Reader */}
          <TextToSpeechReader content={post.content} />

          {/* Content */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags?.nodes?.length > 0 && (
            <div className={styles.tagsSection}>
              <div className={styles.tagsList}>
                {post.tags.nodes.map((tag: any) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className={styles.tagLink}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>


      {/* Read More Section */}
      {relatedPosts.length > 0 && (
        <div className={`${styles.container} ${styles.readMoreSection}`}>
          <h3 className={styles.readMoreTitle}>Read More</h3>
          <div className={styles.readMoreGrid}>
            {relatedPosts.map((post: any) => (
              <div key={post.id} className={styles.relatedPostCard}>
                 <Link href={`/posts/${post.slug}`} className={styles.relatedImageLink}>
                   {post.featuredImage?.node?.sourceUrl ? (
                     <Image
                       src={post.featuredImage.node.sourceUrl}
                       alt={post.title}
                       fill
                       className={styles.relatedImage}
                     />
                   ) : (
                     <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                   )}
                 </Link>
                 <div className="flex flex-col">
                    <div className={styles.relatedCategory}>
                      {post.categories?.nodes?.[0]?.name || 'Blog'}
                    </div>
                    <Link href={`/posts/${post.slug}`} className={styles.relatedTitle}>
                        {post.title}
                    </Link>
                    <div className={styles.relatedDate}>
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
    </div>
  );
}
