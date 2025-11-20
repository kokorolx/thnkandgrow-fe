require('dotenv').config({ path: '.env.local' });
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

const headers = {};
if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
  headers.Authorization = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://blog.thnkandgrow.com/graphql',
    fetch,
    headers
  }),
  cache: new InMemoryCache(),
});

const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 100) {
      nodes {
        name
        slug
        id
      }
    }
  }
`;

async function checkCategories() {
  try {
    const { data } = await client.query({ query: GET_CATEGORIES });
    console.log('Available Categories:');
    data.categories.nodes.forEach(cat => {
      console.log(`- Name: ${cat.name}, Slug: ${cat.slug}`);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

checkCategories();
