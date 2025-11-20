import Link from 'next/link';
import { getApolloClient } from '@/lib/apollo';
import { GET_GENERAL_SETTINGS, GET_RECENT_POSTS, GET_CATEGORIES, GET_TAGS } from '@/lib/queries';
import styles from './Footer.module.css';

export default async function Footer() {
  const client = getApolloClient();

  // Fetch all data server-side
  const [settingsData, recentPostsData, categoriesData, tagsData] = await Promise.all([
    client.query({ query: GET_GENERAL_SETTINGS }),
    client.query({ query: GET_RECENT_POSTS, variables: { first: 5 } }),
    client.query({ query: GET_CATEGORIES }),
    client.query({ query: GET_TAGS, variables: { first: 8 } }),
  ]);

  const blogName = (settingsData.data as any)?.generalSettings?.title || 'Newsroom';
  const recentPosts = (recentPostsData.data as any)?.posts?.nodes || [];
  // Limit categories to 8 to balance footer height
  const categories = (categoriesData.data as any)?.categories?.nodes?.slice(0, 8) || [];
  const tags = (tagsData.data as any)?.tags?.nodes || [];

  // Calculate year once during server render to prevent hydration mismatch
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Breadcrumbs / Top Section */}
        <div className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>{blogName}</Link>
          <span className={styles.separator}>›</span>
          <span className={styles.separator}>Newsroom</span>
        </div>

        {/* Links Grid */}
        <div className={styles.grid}>
          {/* Recent Posts */}
          <div>
            <h3 className={styles.columnTitle}>Recent Posts</h3>
            <ul className={styles.linkList}>
              {recentPosts.slice(0, 4).map((post: any) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.slug}`} className={styles.link}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={styles.columnTitle}>Categories</h3>
            <ul className={styles.linkList}>
              {categories.map((category: any) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className={styles.link}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <h3 className={styles.columnTitle}>Popular Tags</h3>
            <ul className={styles.linkList}>
              {tags.map((tag: any) => (
                <li key={tag.id}>
                  <Link href={`/tag/${tag.slug}`} className={styles.link}>
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className={styles.columnTitle}>About</h3>
            <ul className={styles.linkList}>
              <li><Link href="/about" className={styles.link}>About Us</Link></li>
              <li><Link href="/contact" className={styles.link}>Contact</Link></li>
              <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={styles.link}>Terms of Use</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className={styles.columnTitle}>Connect</h3>
            <ul className={styles.linkList}>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Twitter</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Facebook</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a></li>
              <li><a href="/rss" className={styles.link}>RSS Feed</a></li>
            </ul>
          </div>

          {/* Blog Values */}
          <div>
            <h3 className={styles.columnTitle}>Values</h3>
            <ul className={styles.linkList}>
              <li><Link href="/accessibility" className={styles.link}>Accessibility</Link></li>
              <li><Link href="/education" className={styles.link}>Education</Link></li>
              <li><Link href="/environment" className={styles.link}>Environment</Link></li>
              <li><Link href="/privacy" className={styles.link}>Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            <p className={styles.bottomText}>
              More ways to shop: <Link href="/contact" className={styles.bottomLink}>Contact us</Link> or call 1-800-MY-BLOG.
            </p>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className={styles.copyrightBar}>
          <div className={styles.copyrightContent}>
            <p className={styles.copyright}>Copyright © {currentYear} {blogName} Inc. All rights reserved.</p>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <span className={styles.divider}>|</span>
              <Link href="/terms" className={styles.legalLink}>Terms of Use</Link>
              <span className={styles.divider}>|</span>
              <Link href="/sitemap.xml" className={styles.legalLink}>Site Map</Link>
            </div>
            <div className={styles.countrySelector}>
              <span>United States</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
