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

// Generate other pages on-demand instead of at build time
export const dynamicParams = true;

// Skip static generation at build time, generate on-demand
export const dynamic = 'force-dynamic';

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
          <div className={styles.socialShare}>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} className={styles.shareButton} title="Share on Facebook" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${post.title}`} className={styles.shareButton} title="Share on X" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.868 6.75h-3.308l7.73-8.835L2.56 2.25h6.772l4.684 6.201 5.428-6.201zM17.55 19.5h1.827L6.281 4.125H4.25l13.3 15.375z"/>
              </svg>
            </a>
            <a href={`mailto:?subject=${post.title}&body=${typeof window !== 'undefined' ? window.location.href : ''}`} className={styles.shareButton} title="Share via Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            <button className={styles.shareButton} title="Copy link" onClick={() => navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
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
