import Link from 'next/link';
import Image from 'next/image';
import { PortfolioProject } from '@/data/portfolio';
import styles from './PortfolioCard.module.css';

interface PortfolioCardProps {
  project: PortfolioProject;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Link href={`/portfolio/${project.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.category}>{project.category}</div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.excerpt}>{project.excerpt}</p>

        <div className={styles.technologies}>
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className={styles.techBadge}>
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className={styles.techBadge}>
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        <div className={styles.date}>{formattedDate}</div>
      </div>
    </Link>
  );
}
