const { ApolloClient, InMemoryCache, HttpLink, gql } = require('@apollo/client');
const fetch = require('cross-fetch');
require('dotenv').config({ path: '.env.local' });

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.WORDPRESS_API_URL || 'https://blog.thnkandgrow.com/graphql',
    fetch,
    headers: {
      Authorization: `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN || ''}`,
    },
  }),
  cache: new InMemoryCache(),
});

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts(first: 10, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
      }
    }
  }
`;

async function test() {
  try {
    console.log('Fetching posts from:', process.env.WORDPRESS_API_URL || 'https://blog.thnkandgrow.com/graphql');
    const { data } = await client.query({ query: GET_ALL_POSTS });
    const posts = data.posts.nodes;
    console.log('Successfully fetched posts:', posts.length);
    posts.forEach(post => {
      console.log(`- ${post.title} (${post.slug})`);
    });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    if (error.networkError) {
      console.error('Network error details:', error.networkError.result);
    }
    if (error.graphQLErrors) {
      console.error('GraphQL errors:', error.graphQLErrors);
    }
  }
}

test();
