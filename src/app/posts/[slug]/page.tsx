import { getApolloClient } from '@/lib/apollo';
import { GET_POST_BY_SLUG, GET_ALL_POSTS, GET_RECENT_POSTS, GET_ALL_POST_SLUGS } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import PostViewTracker from '@/components/PostViewTracker';
import StructuredData from '@/components/StructuredData';
import { TextToSpeechWrapper } from '@/components/TextToSpeechWrapper';
import { ShareButtons } from '@/components/ShareButtons';
import ImageWithFallback from '@/components/ImageWithFallback';
import { PostContent } from '@/components/PostContent';
import { calculateReadingTime } from '@/lib/utils';
import styles from './page.module.css';

// ISR: Use on-demand revalidation instead of static generation at build time
// This prevents build failures when Cloudflare blocks GraphQL requests
export const revalidate = 3600; // 1 hour

// Allow generating new pages on-demand (beyond those generated at build time)
export const dynamicParams = true;

export async function generateStaticParams() {
  // Return empty array - pages will be generated on-demand
  // This allows the build to succeed even if GraphQL is unreachable
  return [];
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
          {/* Category Label */}
          {post.categories?.nodes[0] && (
            <Link href={`/category/${post.categories.nodes[0].slug}`} className={styles.categoryLink}>
              <span className={styles.categoryLabel}>{post.categories.nodes[0].name}</span>
            </Link>
          )}

          {/* Date */}
          <time className={styles.publishDate}>
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>

          {/* Main Title */}
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: post.title }} />

          {/* Subtitle/Excerpt */}
          {post.excerpt && (
            <p className={styles.subtitle} dangerouslySetInnerHTML={{ __html: post.excerpt.replace(/\u003c[^\u003e]*\u003e/g, '') }} />
          )}

          {/* Social Share Icons */}
          <ShareButtons title={post.title} />
        </div>
      </header>

        {/* Hero Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <div className={styles.heroImageWrapper}>
             <div className={styles.heroImageContainer}>
               <ImageWithFallback
                 src={post.featuredImage.node.sourceUrl}
                 alt={post.featuredImage.node.altText || post.title}
                 fill
                 className={styles.heroImage}
                 priority
                 fallback="/images/placeholder.svg"
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
          <TextToSpeechWrapper content={post.content} />

          {/* Content with image fallback handling */}
          <PostContent
            content={post.content}
            className={styles.content}
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
