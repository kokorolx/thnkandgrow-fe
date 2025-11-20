import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';

const createApolloClient = (): ApolloClient => {
  const headers: Record<string, string> = {};
  const token = process.env.WORDPRESS_AUTH_REFRESH_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const httpLink = new HttpLink({
    uri: process.env.WORDPRESS_API_URL || 'https://blog.thnkandgrow.com/graphql',
    headers,
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
  });
};

let apolloClient: ApolloClient | undefined;

export const getApolloClient = (): ApolloClient => {
  if (!apolloClient || typeof window === 'undefined') {
    apolloClient = createApolloClient();
  }
  return apolloClient;
};
