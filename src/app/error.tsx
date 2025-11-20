'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Something went wrong!</h2>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          backgroundColor: 'var(--accent-color)',
          color: '#fff',
          border: 'none',
          borderRadius: '980px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        Try again
      </button>
    </div>
  );
}
