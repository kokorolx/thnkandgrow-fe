import Script from 'next/script';

interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type?: 'article' | 'breadcrumb' | 'website';
  article?: ArticleSchema;
  breadcrumbs?: BreadcrumbItem[];
}

export default function StructuredData({ type = 'website', article, breadcrumbs }: StructuredDataProps) {
  const getSchema = () => {
    const baseUrl = 'https://blog.thnkandgrow.com';

    switch (type) {
      case 'article':
        if (!article) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.headline,
          description: article.description,
          image: article.image || `${baseUrl}/og-image.png`,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          author: {
            '@type': 'Person',
            name: article.author.name,
          },
          publisher: {
            '@type': 'Organization',
            name: 'ThnkAndGrow',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
        };

      case 'breadcrumb':
        if (!breadcrumbs || breadcrumbs.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      case 'website':
      default:
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ThnkAndGrow',
          url: baseUrl,
          description: 'Thoughts on growth, technology, and life',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };
    }
  };

  const schema = getSchema();

  if (!schema) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
