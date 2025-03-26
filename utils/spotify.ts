export const SPOTIFY_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-modify-playback-state',
    'user-read-playback-state',
    'streaming'
  ]
};

export const getSpotifyAuthUrl = () => {
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: SPOTIFY_CONFIG.clientId,
    scope: SPOTIFY_CONFIG.scopes.join(' '),
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const searchTracks = async (query: string, accessToken: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search tracks');
  }

  return response.json();
};

export const getTrack = async (trackId: string, accessToken: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get track');
  }

  return response.json();
}; 