'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

interface SpotifyPlayerProps {
  accessToken: string;
  trackUri: string;
}

export function SpotifyPlayer({ accessToken, trackUri }: SpotifyPlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Music Mosaic Player',
        getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
        volume: 0.5,
      });

      playerRef.current = player;

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setPlayer(player);
        // Transfer playback to our device
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        });
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [accessToken]);

  const togglePlayback = async () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      await playerRef.current.pause();
    } else {
      await playerRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = async () => {
    if (!playerRef.current) return;

    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [trackUri],
      }),
    });
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button onClick={togglePlayback}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={playTrack}>Play Track</Button>
      </div>
    </div>
  );
} 