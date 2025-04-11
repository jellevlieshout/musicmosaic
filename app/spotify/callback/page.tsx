"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpotifyStore } from "@/stores/spotifyStore";

export default function SpotifyCallback() {
  const router = useRouter();
  const setAccessToken = useSpotifyStore((state) => state.setAccessToken);

  useEffect(() => {
    // Get the access token from the URL hash
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1];
      if (token) {
        setAccessToken(token);
      }
    }
    router.push("/protected");
  }, [router, setAccessToken]);

  return (
    <div className="container mx-auto p-4">
      <p>Processing Spotify authorization...</p>
    </div>
  );
} 