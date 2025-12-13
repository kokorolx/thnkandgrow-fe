import type { Metadata } from 'next';
import styles from './page.module.css';

// Static generation for about page
export const revalidate = 604800; // Revalidate weekly
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About - Le Hoang Tam',
  description: 'Senior Software Developer with 7+ years of experience in Full Stack Development, specializing in Ruby on Rails, Node.js, and AWS.',
  openGraph: {
    title: 'About - Le Hoang Tam',
    description: 'Senior Software Developer with 7+ years of experience in Full Stack Development, specializing in Ruby on Rails, Node.js, and AWS.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Le Hoang Tam</h1>
          <p className={styles.subtitle}>Working at NUSTechnology</p>
          <p className={styles.intro}>
            Full Stack Ruby on Rails/Node.js Engineer | AWS Certified | Tech Enthusiast who loves learning and sharing
          </p>
        </header>

        <section className={styles.section}>
          <p className={styles.description}>
            I am currently a Senior Software Developer at <a href="https://nustechnology.com" target="_blank" rel="noopener noreferrer" className={styles.link}>NUS Technology</a>.
          </p>
          <p className={styles.description}>
            Senior Software Developer with 7+ years of experience leveraging strong technical skills (Ruby on Rails, Node.js, ReactJS, Vue.js) to deliver high-quality web and SPA applications. Championing a client-oriented view, I consistently deliver solutions that exceed expectations. Seeking a role where I can utilize my full-stack expertise and contribute to the team's success. Actively expanding my knowledge in Solution Architecture and Amazon Web Service to become a well-rounded developer.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Technical Expertise</h2>
          <ul className={styles.list}>
            <li><strong>Full-Stack Development:</strong> Ruby (2.0+), JavaScript (ES5-ESnext, TypeScript), Go</li>
            <li><strong>Web Frameworks:</strong> Mastered Ruby on Rails (4.0-7.1), Node.js (Express, Sails, Strapi, Nest)</li>
            <li><strong>Frontend Powerhouse:</strong> Vue.js (Nuxt), React.js (Next), UI frameworks (Bootstrap, Tailwind, Quasar)</li>
            <li><strong>Testing Champion:</strong> Ruby (Cucumber, RSpec, Capybara), JavaScript (Jest)</li>
            <li><strong>Cloud Architect:</strong> AWS (EC2, S3, Lambda, RDS, etc.), GCP, Heroku</li>
            <li><strong>Polyglot Databases:</strong> MySQL, PostgreSQL, MongoDB, NoSQL (DynamoDB, Redis)</li>
            <li><strong>Payment Integrations:</strong> PayPal, Stripe, and more</li>
            <li><strong>DevOps Mastermind:</strong> Infrastructure design, Cloud provisioning (AWS, DO), Deployment automation (Mina, Capistrano, Docker), System optimization & security best practices</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Timeline of My Work Experience and Learning Journey</h2>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <h3 className={styles.year}>2025 (Present)</h3>
              <h4 className={styles.timelineTitle}>Deep Learning in AWS and Security Solution Architecture</h4>
              <ul className={styles.list}>
                <li><strong>Skills Development:</strong> Gained advanced knowledge and expertise in AWS and security solution architecture.</li>
                <li><strong>Training Sessions:</strong> Conducted training sessions on AWS security best practices for company employees, enhancing team capabilities in cloud security. (UPCOMING)</li>
              </ul>
            </div>

            <div className={styles.timelineItem}>
              <h3 className={styles.year}>Late 2024</h3>
              <h4 className={styles.timelineTitle}>Advanced AWS Architecture & Solutions</h4>
              <ul className={styles.list}>
                <li><strong>Skills Development:</strong> Gained advanced knowledge and expertise in AWS and solution architecture.</li>
                <li><strong>Training Sessions:</strong> Conducted training sessions on Docker orchestration.</li>
              </ul>

              <div className={styles.certGrid}>
                <div className={styles.certItem}>
                  <a href="https://www.credly.com/badges/16aa9a80-3de3-4ade-a79d-8d2404f04cc9" target="_blank" rel="noopener noreferrer">
                    <img src="/images/certs/aws-cloud-quest-solutions-architect.png" alt="AWS Cloud Quest: Solutions Architect" />
                    <span>Dec 2024</span>
                  </a>
                </div>
                <div className={styles.certItem}>
                  <a href="https://www.credly.com/badges/1095af8b-5aac-47f9-becf-c40380192a1b/public_url" target="_blank" rel="noopener noreferrer">
                    <img src="/images/certs/aws-solutions-architect-associate.png" alt="AWS Certified Solutions Architect – Associate" />
                    <span>Sep 2024</span>
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <h3 className={styles.year}>Mid 2024</h3>
              <h4 className={styles.timelineTitle}>Cloud Foundations & Specializations</h4>
              <div className={styles.certGrid}>
                <div className={styles.certItem}>
                  <a href="https://www.credly.com/badges/2133a4ad-ed89-4a1c-a51a-d19676438f9f/public_url" target="_blank" rel="noopener noreferrer">
                    <img src="/images/certs/aws-cloud-practitioner.png" alt="AWS Certified Cloud Practitioner" />
                    <span>Jun 2024</span>
                  </a>
                </div>
                <div className={styles.certItem}>
                  <a href="https://www.credly.com/badges/df07128a-b1d8-4e2b-be42-7a9463f4aafe" target="_blank" rel="noopener noreferrer">
                    <img src="/images/certs/aws-cloud-quest-cloud-practitioner.png" alt="AWS Cloud Quest: Cloud Practitioner" />
                    <span>Jun 2024</span>
                  </a>
                </div>
                <div className={styles.certItem}>
                  <a href="https://www.credly.com/badges/df07128a-b1d8-4e2b-be42-7a9463f4aafe" target="_blank" rel="noopener noreferrer">
                    <img src="/images/certs/aws-eks.png" alt="AWS Knowledge: Amazon EKS" />
                    <span>Jun 2024</span>
                  </a>
                </div>
                <div className={styles.certItem}>
                  <a href="https://www.credly.com/badges/6fed4a9a-21f2-4acf-9385-7223a3168a86" target="_blank" rel="noopener noreferrer">
                    <img src="/images/certs/aws-solution-architecture.png" alt="AWS Solution Architecture" />
                    <span>May 2024</span>
                  </a>
                </div>
                <div className={styles.certItem}>
                  <a href="https://www.credly.com/badges/6fed4a9a-21f2-4acf-9385-7223a3168a86" target="_blank" rel="noopener noreferrer">
                    <img src="/images/certs/aws-serverless.png" alt="AWS Knowledge: Serverless" />
                    <span>May 2024</span>
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <h3 className={styles.year}>2023</h3>
              <h4 className={styles.timelineTitle}>Promoted to Senior Software Developer</h4>
              <ul className={styles.list}>
                <li>Led development of critical features and mentored junior developers</li>
                <li>Architected scalable solutions for high-traffic applications</li>
                <li>Implemented CI/CD pipelines and DevOps best practices</li>
              </ul>
            </div>

            <div className={styles.timelineItem}>
              <h3 className={styles.year}>2018-2022</h3>
              <h4 className={styles.timelineTitle}>Full Stack Developer</h4>
              <ul className={styles.list}>
                <li>Developed and maintained multiple web applications using Ruby on Rails and Node.js</li>
                <li>Built responsive frontends with React.js and Vue.js</li>
                <li>Integrated payment systems and third-party APIs</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
