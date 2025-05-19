"use client";

import HomeView from "@/views/HomeView";
import { useSpotifyStore } from "@/stores/spotifyStore";
import { getSpotifyAuthUrl } from "@/utils/spotify";
import { useEffect } from "react";

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
          return; // Exit early if the response is not okay...
        }
        return response.json(); // ...but if OK, parse the JSON payload...
      })
      .then(data => {
        if (data) {
          setDisplayName(data.display_name); // ...and get spotify display name
        }
      })      .catch(() => {
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
    <HomeView 
      isSpotifyConnected={isSpotifyConnected}
      onSpotifyConnect={handleSpotifyConnect}
      spotifyDisplayName={displayName}
    />
  );
}