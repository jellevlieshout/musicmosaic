'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSpotifyAuthUrl, searchTracks } from '@/utils/spotify';
import { SpotifyPlayer } from '@/components/spotify-player';

export default function SpotifyPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have a token in the URL hash
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token'))?.split('=')[1];
      if (token) {
        console.log('Token found:', token);
        setAccessToken(token);
        window.location.hash = '';
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!accessToken || !searchQuery) return;
    
    setIsLoading(true);
    try {
      const results = await searchTracks(searchQuery, accessToken);
      setSearchResults(results.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Spotify Integration</h1>
      
      {!accessToken ? (
        <div className="flex flex-col items-center gap-4">
          <p>Connect with Spotify to start searching and playing music</p>
          <Button onClick={() => window.location.href = getSpotifyAuthUrl()}>
            Connect with Spotify
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for a song..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="grid gap-2">
            {searchResults.map((track) => (
              <div
                key={track.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedTrack(track)}
              >
                <div className="font-medium">{track.name}</div>
                <div className="text-sm text-gray-600">{track.artists[0].name}</div>
              </div>
            ))}
          </div>

          {selectedTrack && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Now Playing</h2>
              <div className="mb-4">
                <div className="font-medium">{selectedTrack.name}</div>
                <div className="text-sm text-gray-600">{selectedTrack.artists[0].name}</div>
              </div>
              <SpotifyPlayer
                accessToken={accessToken}
                trackUri={selectedTrack.uri}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 