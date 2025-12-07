'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      if (typeof window !== 'undefined') {
        // Set both cookie and localStorage
        document.cookie = `oil_works_auth=true; max-age=${7 * 24 * 60 * 60}; path=/; SameSite=Strict`;
        localStorage.setItem('isLoggedIn', 'true');
      }
      router.push('/dashboard');
    } else {
      setError('Invalid username or password!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/logo.jpeg')] bg-center bg-cover opacity-5"></div>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-white/20">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
              <img 
                src="/logo.jpeg" 
                alt="The Oil Works Logo" 
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-2xl border-4 border-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%234F46E5" width="100" height="100"/><text x="50" y="55" font-size="40" text-anchor="middle" fill="white" font-family="Arial">OW</text></svg>';
                }}
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            THE OIL WORKS
          </h1>
          <p className="text-gray-600 font-medium">Professional POS System</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Login</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2 font-medium">Default Credentials:</p>
            <div className="font-mono text-sm bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Username: <strong className="text-blue-600">admin</strong></span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Password: <strong className="text-purple-600">admin123</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
