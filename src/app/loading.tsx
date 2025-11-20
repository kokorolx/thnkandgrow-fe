export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
      width: '100%'
    }}>
      <div className="loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--background-alt)',
        borderTop: '3px solid var(--accent-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
