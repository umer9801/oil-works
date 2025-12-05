'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #1f2937, #111827)',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '28rem',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Application Error
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {error.message || 'Something went wrong'}
            </p>
            <button
              onClick={reset}
              style={{
                width: '100%',
                background: '#2563eb',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
