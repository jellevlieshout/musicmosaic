"use client";

import HomeView from "@/views/HomeView";
import { useSpotifyStore } from "@/stores/spotifyStore";
import { getSpotifyAuthUrl } from "@/utils/spotify";
import { useEffect } from "react";

export default function HomePresenter() {
  const accessToken = useSpotifyStore((state) => state.accessToken);
  const setAccessToken = useSpotifyStore((state) => state.setAccessToken);
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
  }, [setAccessToken]);

  const handleSpotifyConnect = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <HomeView 
      isSpotifyConnected={isSpotifyConnected}
      onSpotifyConnect={handleSpotifyConnect}
    />
  );
}