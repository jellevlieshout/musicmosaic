"use client";

import HomeView from "@/views/HomeView";
import { useSpotifyStore } from "@/stores/spotifyStore";
import { getSpotifyAuthUrl } from "@/utils/spotify";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function HomePresenter() {
  const accessToken = useSpotifyStore((state) => state.accessToken);
  const setAccessToken = useSpotifyStore((state) => state.setAccessToken);
  const displayName = useSpotifyStore((state) => state.displayName);
  const setDisplayName = useSpotifyStore((state) => state.setDisplayName);
  const isSpotifyConnected = !!accessToken;

  useEffect(() => {
    // Get the access token from the URL hash
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1];
      if (token) {
        setAccessToken(token);
        // Clear the hash from the URL
        window.location.hash = "";
      }
    }

    // Test if the current token is valid
    if (accessToken) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        if (!response.ok) {
          // Token is invalid, clear it
          setAccessToken(null);
          setDisplayName(null);
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setDisplayName(data.display_name);
          
          // Check if user has Premium
          if (data.product !== 'premium') {
            toast.error('Unfortunately, this app requires a Spotify Premium account to work. Please upgrade your account to continue.', {
              duration: 5000,
              position: 'top-center',
              style: {
                background: '#333',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
            });
            setAccessToken(null);
            setDisplayName(null);
            return;
          }

          // If we get here, user has Premium, now check playback scopes
          fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(devicesResponse => {
            if (!devicesResponse.ok) {
              console.log('Token does not have playback scopes');
              toast.error('Unable to access playback features. Please try reconnecting to Spotify.', {
                duration: 4000,
                position: 'top-center',
                style: {
                  background: '#333',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                },
              });
              setAccessToken(null);
              setDisplayName(null);
            } else {
              console.log('Token has playback scopes and can use Web Playback SDK');
              toast.success('You are connected to Spotify. Use the "New Game" button to start playing.', {
                duration: 4000,
                position: 'top-center',
                style: {
                  background: '#1DB954',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                },
              });
            }
          });
        }
      })
      .catch(() => {
        // Error occurred, clear the token
        setAccessToken(null);
        setDisplayName(null);
      });
    }
  }, [setAccessToken, accessToken]);

  const handleSpotifyConnect = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <>
      <Toaster />
      <HomeView 
        isSpotifyConnected={isSpotifyConnected}
        onSpotifyConnect={handleSpotifyConnect}
        spotifyDisplayName={displayName}
      />
    </>
  );
}