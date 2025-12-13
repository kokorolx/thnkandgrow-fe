import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ApolloWrapper } from '@/lib/ApolloWrapper';
import { getApolloClient } from '@/lib/apollo';
import { GET_GENERAL_SETTINGS } from '@/lib/queries';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const client = getApolloClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.thnkandgrow.com';

  try {
    const { data } = await client.query({
      query: GET_GENERAL_SETTINGS,
    }) as any;

    const settings = data?.generalSettings;

    if (!settings) {
      return {
        title: 'ThnkAndGrow - Personal Blog',
        description: 'Thoughts on growth, technology, and life.',
      };
    }

    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: settings.title || 'ThnkAndGrow',
        template: `%s | ${settings.title || 'ThnkAndGrow'}`
      },
      description: settings.description || 'Thoughts on growth, technology, and life.',
      alternates: {
        canonical: '/',
      },
      openGraph: {
        title: settings.title || 'ThnkAndGrow',
        description: settings.description || 'Thoughts on growth, technology, and life.',
        url: baseUrl,
        siteName: settings.title || 'ThnkAndGrow',
        type: 'website',
        locale: settings.language || 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: settings.title || 'ThnkAndGrow',
        description: settings.description || 'Thoughts on growth, technology, and life.',
      }
    };
  } catch (error) {
    console.error('Error fetching general settings:', error);
    return {
      title: 'ThnkAndGrow - Personal Blog',
      description: 'Thoughts on growth, technology, and life.',
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 300px)' }}>
            {children}
          </main>
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}
