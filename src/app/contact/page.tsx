import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - ThnkAndGrow',
  description: 'Get in touch with the ThnkAndGrow team.',
};

export default function ContactPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '30px' }}>Contact Us</h1>
      <div className="content" style={{ fontSize: '19px', lineHeight: '1.6', color: 'var(--text-color)' }}>
        <p style={{ marginBottom: '20px' }}>
          Have questions or feedback? We'd love to hear from you.
        </p>
        <p>
          You can reach us at: <a href="mailto:contact@thnkandgrow.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>contact@thnkandgrow.com</a>
        </p>
      </div>
    </div>
  );
}
