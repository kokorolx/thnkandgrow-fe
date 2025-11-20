import Link from 'next/link';
import styles from './page.module.css';

export default function NotFound() {
  return (
    <div className={styles.container} style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ fontSize: '19px', color: 'var(--text-color-secondary)', marginBottom: '40px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={styles.button} style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: 'var(--accent-color)',
        color: '#fff',
        borderRadius: '980px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 600
      }}>
        Return Home
      </Link>
    </div>
  );
}
