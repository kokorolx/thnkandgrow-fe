import Link from 'next/link';
import Image from 'next/image';
import ImageWithFallback from './ImageWithFallback';
import styles from './PostCard.module.css';

interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: {
    name: string;
    slug?: string;
    avatar?: string;
  };
  coverImage?: string;
  category?: string;
  categorySlug?: string;
  readingTime?: string;
}

export default function PostCard({ title, excerpt, slug, date, author, coverImage, category, categorySlug, readingTime }: PostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className={styles.card}>
      <Link href={`/posts/${slug}`} className={styles.imageLink}>
        {coverImage ? (
          <ImageWithFallback
            src={coverImage}
            alt={title}
            fill
            className={styles.image}
            fallback="/images/placeholder.svg"
          />
        ) : (
          <div className={styles.noImage}>
            No Image
          </div>
        )}
      </Link>

      <div className={styles.content}>
        {/* Category Badge */}
        <div className={styles.categoryWrapper}>
          {category && (
            <Link href={`/category/${categorySlug || category.toLowerCase().replace(/\s+/g, '-')}`} className={styles.categoryLink}>
              <span className={styles.category}>
                {category}
              </span>
            </Link>
          )}
        </div>

        {/* Title */}
        <Link href={`/posts/${slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>
            {title}
          </h3>
        </Link>

        {/* Meta: Date, Author, Reading Time */}
        <div className={styles.meta}>
          <time className={styles.date}>{formattedDate}</time>
          {readingTime && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.readingTime}>{readingTime}</span>
            </>
          )}
        </div>

        {author && (
          <div className={styles.author}>
            <span className={styles.by}>by</span>
            {author.slug ? (
              <Link href={`/author/${author.slug}`} className={styles.authorLink}>
                {author.name}
              </Link>
            ) : (
              <span className={styles.authorName}>{author.name}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
