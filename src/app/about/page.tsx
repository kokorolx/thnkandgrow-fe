import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - ThnkAndGrow',
  description: 'Learn more about ThnkAndGrow and our mission.',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '30px' }}>About Us</h1>
      <div className="content" style={{ fontSize: '19px', lineHeight: '1.6', color: 'var(--text-color)' }}>
        <p style={{ marginBottom: '20px' }}>
          Welcome to ThnkAndGrow. We are dedicated to providing high-quality content about technology, software development, and personal growth.
        </p>
        <p>
          Our mission is to empower developers and thinkers to grow their skills and mindsets through in-depth articles, tutorials, and insights.
        </p>
      </div>
    </div>
  );
}
