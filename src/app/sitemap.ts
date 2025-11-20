import { MetadataRoute } from 'next';
import { getApolloClient } from '@/lib/apollo';
import { GET_ALL_POST_SLUGS, GET_CATEGORIES, GET_TAGS, GET_USERS } from '@/lib/queries';

const BASE_URL = 'https://blog.thnkandgrow.com';

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

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
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
