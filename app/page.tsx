'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Check both cookie and localStorage
      const cookieAuth = document.cookie.includes('oil_works_auth=true');
      const localAuth = localStorage.getItem('isLoggedIn') === 'true';
      const isLoggedIn = cookieAuth || localAuth;
      
      if (!isLoggedIn) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return null;
}
