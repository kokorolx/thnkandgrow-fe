import { getApolloClient } from '@/lib/apollo';
import { GET_ALL_POSTS, GET_RECENT_POSTS, GET_CATEGORIES, GET_GENERAL_SETTINGS, GET_POSTS_BY_CATEGORY } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import { calculateReadingTime } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import styles from './page.module.css';

// Revalidate every 3 days
export const revalidate = 259200;

export async function generateMetadata(): Promise<Metadata> {
  const client = getApolloClient();

  try {
    const { data } = await client.query({
      query: GET_GENERAL_SETTINGS,
    }) as any;

    const settings = data?.generalSettings;

    return {
      title: settings?.title || 'ThnkAndGrow - Personal Blog',
      description: settings?.description || 'Thoughts on growth, technology, and life.',
      openGraph: {
        title: settings?.title || 'ThnkAndGrow - Personal Blog',
        description: settings?.description || 'Thoughts on growth, technology, and life.',
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'ThnkAndGrow - Personal Blog',
      description: 'Thoughts on growth, technology, and life.',
    };
  }
}

async function getPosts() {
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_ALL_POSTS,
    }) as any;
    return data?.posts?.nodes || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getArchitecturePosts() {
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_CATEGORY,
      variables: { slug: 'architecture-and-design' },
    }) as any;
    
    return {
      posts: data?.category?.posts?.nodes || [],
      categorySlug: data?.category?.slug || 'architecture-and-design',
      categoryName: data?.category?.name || 'Architecture & Design'
    };
  } catch (error) {
    console.error('Error fetching architecture posts:', error);
    return { posts: [], categorySlug: null, categoryName: null };
  }
}

async function getDatabasePosts() {
  const client = getApolloClient();
  try {
    const { data } = await client.query({
      query: GET_POSTS_BY_CATEGORY,
      variables: { slug: 'database' },
    }) as any;
    
    return {
      posts: data?.category?.posts?.nodes || [],
      categorySlug: data?.category?.slug || 'database',
      categoryName: data?.category?.name || 'Database'
    };
  } catch (error) {
    console.error('Error fetching database posts:', error);
    return { posts: [], categorySlug: null, categoryName: null };
  }
}

export default async function Home() {
  const posts = await getPosts();
  const architectureData = await getArchitecturePosts();
  const databaseData = await getDatabasePosts();
  
  const featuredPost = posts[0];
  // Show 6 recent posts (excluding the hero) for the grid
  const recentPosts = posts.slice(1, 7);
  // Show 10 posts for "In the Loop" carousel (most read posts)
  const inTheLoopPosts = posts.slice(1, 11);
  // Show 6 posts for "More from Newsroom" section
  const moreFromNewsroom = posts.slice(11, 17);
  
  // Architecture section: featured post + 3 grid posts
  const architectureFeatured = architectureData.posts[0];
  const architectureGrid = architectureData.posts.slice(1, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      {featuredPost && (
        <section className={`${styles.container} ${styles.heroSection}`}>
          <Link href={`/posts/${featuredPost.slug}`} className={styles.heroLink}>
             {featuredPost.featuredImage?.node?.sourceUrl ? (
               <Image
                 src={featuredPost.featuredImage.node.sourceUrl}
                 alt={featuredPost.title}
                 fill
                 className={styles.heroImage}
                 priority
               />
             ) : (
               <div className="w-full h-full bg-gray-200" />
             )}

             {/* Gradient Overlay */}
             <div className={styles.heroOverlay}>
                <div className={styles.heroContent}>
                  <span className={styles.heroCategory}>
                    {featuredPost.categories?.nodes?.[0]?.name || 'Featured'}
                  </span>
                  <h2 className={styles.heroTitle}>
                    {featuredPost.title}
                  </h2>
                </div>
             </div>
          </Link>
        </section>
      )}

      {/* Latest News Grid */}
      <section className={`${styles.container} ${styles.latestNewsSection}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest News</h2>
          <Link href="/category/all" className={styles.archiveLink}>
            View Archive ›
          </Link>
        </div>

        <div className={styles.grid}>
          {recentPosts.map((post: any) => (
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
      </section>

      {/* In the Loop Section - Horizontal Scrollable Carousel */}
      {inTheLoopPosts.length > 0 && (
        <section className={`${styles.container} ${styles.inTheLoopSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>In the Loop</h2>
          </div>
          <div className={styles.carouselWrapper}>
            <div className={styles.carousel}>
              {inTheLoopPosts.map((post: any) => (
                <div key={post.id} className={styles.carouselItem}>
                  <PostCard
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
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Architecture Section */}
      {architectureFeatured && architectureData.categorySlug && (
        <section className={`${styles.container} ${styles.architectureSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{architectureData.categoryName || 'Architecture'}</h2>
            <Link href={`/category/${architectureData.categorySlug}`} className={styles.archiveLink}>
              View All ›
            </Link>
          </div>

          {/* Featured Card */}
          <Link href={`/posts/${architectureFeatured.slug}`} className={styles.architectureFeaturedLink}>
            {architectureFeatured.featuredImage?.node?.sourceUrl ? (
              <Image
                src={architectureFeatured.featuredImage.node.sourceUrl}
                alt={architectureFeatured.title}
                fill
                className={styles.architectureFeaturedImage}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}

            {/* Overlay */}
            <div className={styles.architectureFeaturedOverlay}>
              <div className={styles.architectureFeaturedContent}>
                <span className={styles.architectureCategory}>
                  {architectureFeatured.categories?.nodes?.[0]?.name || 'Architecture'}
                </span>
                <h3 className={styles.architectureFeaturedTitle}>
                  {architectureFeatured.title}
                </h3>
                <div className={styles.architectureFeaturedMeta}>
                  <time>{new Date(architectureFeatured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                </div>
              </div>
            </div>
          </Link>

          {/* Grid of 3 Posts */}
          {architectureGrid.length > 0 && (
            <div className={styles.architectureGrid}>
              {architectureGrid.map((post: any) => (
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
          )}
        </section>
      )}

      {/* More from Database Section */}
      {databaseData.posts.length > 0 && (
        <section className={`${styles.container} ${styles.moreFromNewsroomSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>More from {databaseData.categoryName || 'Database'}</h2>
            <Link href={`/category/${databaseData.categorySlug}`} className={styles.archiveLink}>
              View All ›
            </Link>
          </div>
          <div className={styles.databaseGrid}>
            {databaseData.posts.slice(0, 6).map((post: any) => (
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
        </section>
      )}

      {/* More from Newsroom Section */}
      {moreFromNewsroom.length > 0 && (
        <section className={`${styles.container} ${styles.moreFromNewsroomSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>More from Newsroom</h2>
          </div>
          <div className={styles.grid}>
            {moreFromNewsroom.map((post: any) => (
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
        </section>
      )}
    </div>
  );
}
