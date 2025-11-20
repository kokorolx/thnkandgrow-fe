export interface PortfolioProject {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  coverImage: string;
  images: string[];
  technologies: string[];
  category: string;
  date: string;
  links: {
    demo?: string;
    github?: string;
    caseStudy?: string;
  };
  featured: boolean;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'thnkandgrow-blog',
    title: 'ThnkAndGrow Blog',
    excerpt: 'A modern blog platform built with Next.js 16 and WordPress headless CMS',
    description: `
      <p>A high-performance blog platform that combines the power of Next.js 16 with WordPress as a headless CMS. The project features a pixel-perfect clone of Apple Newsroom's design aesthetic, complete with advanced features like Text-to-Speech reading and Incremental Static Regeneration.</p>

      <h2>Key Features</h2>
      <ul>
        <li>Server-side rendering with Next.js 16 App Router</li>
        <li>Headless WordPress CMS integration via GraphQL</li>
        <li>Incremental Static Regeneration (ISR) for optimal performance</li>
        <li>Text-to-Speech reader with progress tracking</li>
        <li>Comprehensive SEO optimization (robots.txt, sitemap, structured data)</li>
        <li>Responsive design matching Apple Newsroom aesthetic</li>
      </ul>

      <h2>Technical Highlights</h2>
      <p>The project showcases modern web development practices including TypeScript for type safety, Apollo Client for GraphQL data fetching, and CSS Modules for component-scoped styling. The ISR implementation ensures fast page loads while keeping content fresh.</p>
    `,
    coverImage: '/portfolio/thnkandgrow-cover.jpg',
    images: [
      '/portfolio/thnkandgrow-1.jpg',
      '/portfolio/thnkandgrow-2.jpg',
      '/portfolio/thnkandgrow-3.jpg',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'WordPress', 'GraphQL', 'Apollo Client', 'CSS Modules'],
    category: 'Web Development',
    date: '2025-01-15',
    links: {
      demo: 'https://blog.thnkandgrow.com',
      github: 'https://github.com/yourusername/thnkandgrow-blog',
    },
    featured: true,
  },
  {
    slug: 'tradeit-gg',
    title: 'TradeIt.gg - CS2 Skin Trading Platform',
    excerpt: 'A comprehensive CS2 (Counter-Strike 2) skin trading platform with automated bot trading, real-time pricing, and instant transactions',
    description: `
      <p>TradeIt.gg is a leading CS2 skin trading platform that revolutionizes how players trade their in-game items. The platform features an advanced automated trading system, real-time market pricing, and instant transactions, making it one of the most efficient CS2 trading platforms available.</p>

      <h2>Key Features</h2>
      <ul>
        <li>Automated bot trading system for instant CS2 skin exchanges</li>
        <li>Real-time market pricing with dynamic valuation algorithms</li>
        <li>Instant deposit and withdrawal system</li>
        <li>Advanced inventory management and filtering</li>
        <li>Trade history and analytics dashboard</li>
        <li>Multi-currency support (USD, EUR, and more)</li>
        <li>Secure authentication with Steam integration</li>
        <li>Responsive design for desktop and mobile trading</li>
      </ul>

      <h2>Technical Achievements</h2>
      <p>The platform handles thousands of concurrent users and processes millions of dollars in trades monthly. Key technical implementations include:</p>
      <ul>
        <li>High-performance real-time pricing engine with WebSocket connections</li>
        <li>Scalable microservices architecture for handling peak loads</li>
        <li>Advanced caching strategies for instant item lookups</li>
        <li>Secure payment processing with multiple payment gateways</li>
        <li>Steam API integration for seamless inventory management</li>
        <li>Comprehensive SEO optimization resulting in top search rankings</li>
      </ul>

      <h2>Impact & Results</h2>
      <p>TradeIt.gg has become one of the most trusted CS2 trading platforms, serving a global community of traders. The platform's focus on security, speed, and user experience has resulted in:</p>
      <ul>
        <li>Millions of successful trades processed</li>
        <li>Top rankings for CS2 trading keywords in search engines</li>
        <li>High user retention and satisfaction rates</li>
        <li>Industry-leading transaction speeds</li>
      </ul>

      <h2>My Contributions</h2>
      <p>As a key contributor to TradeIt.gg, I focused on:</p>
      <ul>
        <li>Implementing comprehensive SEO strategies that significantly improved organic traffic</li>
        <li>Developing analytics and insights dashboards for user behavior tracking</li>
        <li>Optimizing performance for high-traffic scenarios</li>
        <li>Enhancing user experience through A/B testing and data-driven improvements</li>
        <li>Implementing advanced security measures to protect user accounts and transactions</li>
      </ul>
    `,
    coverImage: '/portfolio/tradeit-cover.jpg',
    images: [
      '/portfolio/tradeit-1.jpg',
      '/portfolio/tradeit-2.jpg',
      '/portfolio/tradeit-3.jpg',
      '/portfolio/tradeit-4.jpg',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'WebSocket',
      'Redis',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'Steam API',
      'SEO',
      'Analytics',
      'Payment Integration'
    ],
    category: 'Web Development',
    date: '2024-12-01',
    links: {
      demo: 'https://tradeit.gg/cs2-skins',
    },
    featured: true,
  },
  // Add more projects here
];

export function getPortfolioProjects(): PortfolioProject[] {
  return portfolioProjects.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getFeaturedProjects(): PortfolioProject[] {
  return portfolioProjects
    .filter(project => project.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find(project => project.slug === slug);
}

export function getRelatedProjects(currentSlug: string, limit: number = 3): PortfolioProject[] {
  const currentProject = getProjectBySlug(currentSlug);
  if (!currentProject) return [];

  return portfolioProjects
    .filter(project =>
      project.slug !== currentSlug &&
      (project.category === currentProject.category ||
       project.technologies.some(tech => currentProject.technologies.includes(tech)))
    )
    .slice(0, limit);
}
