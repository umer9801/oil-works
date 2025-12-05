'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h1>
          <p className="text-gray-600 text-sm">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <Link href="/login">
            <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Go to Login
            </button>
          </Link>

          <Link href="/">
            <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Go to Home
            </button>
          </Link>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            <strong>Troubleshooting:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Clear browser cache and cookies</li>
            <li>• Try in incognito/private mode</li>
            <li>• Check your internet connection</li>
            <li>• Contact support if issue persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
