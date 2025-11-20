import { Metadata } from 'next';
import { getPortfolioProjects } from '@/data/portfolio';
import PortfolioCard from '@/components/PortfolioCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Portfolio - ThnkAndGrow',
  description: 'Explore my portfolio of web development projects, showcasing modern technologies and best practices.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio - ThnkAndGrow',
    description: 'Explore my portfolio of web development projects, showcasing modern technologies and best practices.',
    url: '/portfolio',
    type: 'website',
  },
};

export default function PortfolioPage() {
  const projects = getPortfolioProjects();

  return (
    <div className="animate-fade-in">
      <section className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Portfolio</h1>
          <p className={styles.description}>
            A collection of projects showcasing modern web development practices,
            innovative solutions, and attention to detail.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className={styles.grid}>
            {projects.map((project) => (
              <PortfolioCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No projects available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
