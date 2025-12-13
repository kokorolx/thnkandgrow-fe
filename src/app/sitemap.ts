import { MetadataRoute } from 'next';
import { getApolloClient } from '@/lib/apollo';
import { GET_ALL_POST_SLUGS, GET_CATEGORIES, GET_TAGS, GET_USERS } from '@/lib/queries';
import { getPortfolioProjects } from '@/data/portfolio';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.thnkandgrow.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getApolloClient();

  try {
    // Fetch all posts, categories, tags, and users in parallel
    const [postsResult, categoriesResult, tagsResult, usersResult] = await Promise.all([
      client.query({ query: GET_ALL_POST_SLUGS }) as any,
      client.query({ query: GET_CATEGORIES }) as any,
      client.query({ query: GET_TAGS, variables: { first: 100 } }) as any,
      client.query({ query: GET_USERS, variables: { first: 100 } }) as any,
    ]);

    const posts = postsResult.data?.posts?.nodes || [];
    const categories = categoriesResult.data?.categories?.nodes || [];
    const tags = tagsResult.data?.tags?.nodes || [];
    const users = usersResult.data?.users?.nodes || [];

    // Get portfolio projects
    const portfolioProjects = getPortfolioProjects();

    // Post pages
    const postPages = posts.map((post: any) => ({
      url: `${BASE_URL}/posts/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Category pages
    const categoryPages = categories.map((category: any) => ({
      url: `${BASE_URL}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Tag pages
    const tagPages = tags.map((tag: any) => ({
      url: `${BASE_URL}/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    // Author pages
    const authorPages = users.map((user: any) => ({
      url: `${BASE_URL}/author/${user.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Portfolio pages
    const portfolioListingPage = {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    };

    const portfolioPages = portfolioProjects.map((project) => ({
      url: `${BASE_URL}/portfolio/${project.slug}`,
      lastModified: new Date(project.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      portfolioListingPage,
      ...portfolioPages,
      ...postPages,
      ...categoryPages,
      ...tagPages,
      ...authorPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return minimal sitemap on error
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
