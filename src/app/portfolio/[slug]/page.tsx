import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback';
import { PostContent } from '@/components/PostContent';
import { getPortfolioProjects, getProjectBySlug, getRelatedProjects } from '@/data/portfolio';
import PortfolioCard from '@/components/PortfolioCard';
import StructuredData from '@/components/StructuredData';
import styles from './page.module.css';

// Static generation for portfolio items
export const revalidate = 86400; // Revalidate daily
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const projects = getPortfolioProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - Portfolio`,
    description: project.excerpt,
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.excerpt,
      url: `/portfolio/${slug}`,
      type: 'article',
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.excerpt,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(slug);
  const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="animate-fade-in">
      <StructuredData
        type="article"
        article={{
          headline: project.title,
          description: project.excerpt,
          image: project.coverImage,
          datePublished: project.date,
          dateModified: project.date,
          author: {
            name: 'ThnkAndGrow',
          },
        }}
      />

      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.category}>{project.category}</div>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.excerpt}>{project.excerpt}</p>

          <div className={styles.meta}>
            <span className={styles.date}>{formattedDate}</span>

            <div className={styles.links}>
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View Live Demo →
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.link} ${styles.linkSecondary}`}
                >
                  View on GitHub
                </a>
              )}
              {project.links.caseStudy && (
                <a
                  href={project.links.caseStudy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.link} ${styles.linkSecondary}`}
                >
                  Read Case Study
                </a>
              )}
            </div>
          </div>
        </header>

        {project.coverImage && (
          <div className={styles.heroImage}>
            <ImageWithFallback
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              fallback="/images/placeholder.svg"
            />
          </div>
        )}

        <div className={styles.technologies}>
          <h2 className={styles.technologiesTitle}>Technologies Used</h2>
          <div className={styles.techList}>
            {project.technologies.map((tech) => (
              <span key={tech} className={styles.techBadge}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        <PostContent
          content={project.description}
          className={styles.content}
        />

        {project.images.length > 0 && (
          <div className={styles.gallery}>
            <h2 className={styles.galleryTitle}>Project Gallery</h2>
            <div className={styles.galleryGrid}>
              {project.images.map((image, index) => (
                <div key={index} className={styles.galleryImage}>
                  <ImageWithFallback
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    fallback="/images/placeholder.svg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedProjects.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Related Projects</h2>
            <div className={styles.relatedGrid}>
              {relatedProjects.map((relatedProject) => (
                <PortfolioCard key={relatedProject.slug} project={relatedProject} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
