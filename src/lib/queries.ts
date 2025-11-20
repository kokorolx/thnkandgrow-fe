import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  query GetAllPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        slug
        excerpt
        date
        modified
        author {
          node {
            name
            firstName
            lastName
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      date
      modified
      slug
      author {
        node {
          name
          firstName
          lastName
          slug
          description
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_ALL_POST_SLUGS = gql`
  query GetAllPostSlugs {
    posts(first: 1000, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(first: 100, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
        parentId
        parent {
          node {
            id
            name
            slug
          }
        }
        description
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($slug: ID!, $first: Int = 10, $after: String) {
    category(id: $slug, idType: SLUG) {
      name
      description
      seo {
        title
        metaDesc
      }
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          slug
          excerpt
          date
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const GET_POSTS_BY_TAG = gql`
  query GetPostsByTag($slug: ID!, $first: Int = 10, $after: String) {
    tag(id: $slug, idType: SLUG) {
      name
      description
      seo {
        title
        metaDesc
      }
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          slug
          excerpt
          date
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($slug: ID!, $first: Int = 10, $after: String) {
    user(id: $slug, idType: SLUG) {
      name
      slug
      description
      avatar {
        url
      }
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          slug
          excerpt
          date
          content
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($first: Int = 100) {
    users(first: $first) {
      nodes {
        slug
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!, $first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { search: $search, status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        slug
        excerpt
        date
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_GENERAL_SETTINGS = gql`
  query GetGeneralSettings {
    generalSettings {
      title
      description
      url
      language
    }
  }
`;

export const GET_RECENT_POSTS = gql`
  query GetRecentPosts($first: Int = 6) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags($first: Int = 10) {
    tags(first: $first) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

// Mutation to increment post views
export const INCREMENT_POST_VIEWS = gql`
  mutation IncrementPostViews($id: ID!) {
    updatePost(input: { id: $id }) {
      post {
        id
        postId
      }
    }
  }
`;


