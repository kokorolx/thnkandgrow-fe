import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = (): ApolloClient => {
  const headers: Record<string, string> = {};
  const token = process.env.WORDPRESS_AUTH_REFRESH_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const httpLink = new HttpLink({
    uri: process.env.WORDPRESS_API_URL || 'https://blog.thnkandgrow.com/graphql',
    headers: {
      ...headers,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
    fetchOptions: {
      timeout: 10000,
    },
    credentials: 'include',
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
      resultCaching: false,
    }),
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
