'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SpotifyCallback() {
  const router = useRouter();

  useEffect(() => {
    // The access token will be in the URL hash
    // We'll handle it in the main page
    router.push('/spotify');
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <p>Processing Spotify authorization...</p>
    </div>
  );
} 