"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NewGameView from "@/views/NewGameView";
import { useGameplayStore } from '@/stores/hitsterModelStore';
import { useSpotifyStore } from '@/stores/spotifyStore';
import { Song } from '@/utils/types';
import { useHitsterPersistence } from '@/hooks/useHitsterPersistence';

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export default function NewGamePresenter() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <NewGameSettingsContent />
    </Suspense>
  );
}

function NewGameSettingsContent() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [gameLength, setGameLength] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPlaylistValid, setIsPlaylistValid] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);

  const searchParams = useSearchParams();
  const gameIdParam = searchParams.get('gameId');
  const { gameId } = useHitsterPersistence(gameIdParam);

  const accessToken = useSpotifyStore((state) => state.accessToken);
  const { setPlaylist, setGameSettings, initializaPlayerDecks, setGameHasStarted, gameHasStarted, gameSettings, currentPlayers } = useGameplayStore();

  useEffect(() => {
    if (accessToken) {
      console.log('accessToken', accessToken);
      console.log('gameId', gameIdParam);
      fetchUserPlaylists();
    }
  }, [accessToken]);

  useEffect(() => {
    validatePlaylist();
  }, [selectedPlaylist, gameLength, playlists]);

  useEffect(() => {
    validateForm();
  }, [location, selectedPlaylist, gameLength, isPlaylistValid]);

  useEffect(() => {
    function fetchLocation() {
        fetch(`https://api.ipgeolocation.io/v2/ipgeo?apiKey=${process.env.NEXT_PUBLIC_LOCATION_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          setLocation(data.location?.city + ", " + data.location?.country_name);
        })
        .catch(error => {
          console.error("Failed to fetch location:", error);
        });
      } 
  
    fetchLocation();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear the token and redirect to home
          useSpotifyStore.getState().clearAccessToken();
          router.push('/protected/home?message=spotify_auth_required');
          return;
        }
        throw new Error('Failed to fetch playlists');
      }

      const data = await response.json();

    
      let formattedPlaylists = data.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        songs: [], // We'll fetch songs when a playlist is selected
      }));

      // Add default playlists
      formattedPlaylists.push(
        {
          id: '47bfM4cUBw6au9hK2PDJMt',
          name: 'All Out 2000s - MusicMosaic',
          songs: [],
        },
        {
          id: '5FhZptY3DqIdAf62fc7OTb',
          name: 'All Out 1990s - MusicMosaic',
          songs: [],
        },
        {
          id: '4W3NFU1efnGhOA4GRc331c',
          name: 'All Out 2010s - MusicMosaic',
          songs: [],
        }
      );

      // Remove duplicate playlists by ID
      const uniquePlaylists = [];
      const playlistIds = new Set();
      
      for (const playlist of formattedPlaylists) {
        if (!playlistIds.has(playlist.id)) {
          playlistIds.add(playlist.id);
          uniquePlaylists.push(playlist);
        }
      }
      
      // Replace the array with deduplicated version
      formattedPlaylists = uniquePlaylists;
      

      setPlaylists(formattedPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const validateForm = () => {
    const isValid = location !== '' && 
                   selectedPlaylist !== '' && 
                   gameLength !== '';
    setIsFormValid(isValid);
  };

  const validatePlaylist = () => {
    const selectedPlaylistData = playlists.find(p => p.id === selectedPlaylist);
    let playlistLengthCheck = true;
    if (selectedPlaylistData?.songs && currentPlayers) {
        playlistLengthCheck = selectedPlaylistData?.songs?.length > +gameLength * currentPlayers?.length
    } else {
        playlistLengthCheck = false;
    }
    setIsPlaylistValid(playlistLengthCheck);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handlePlaylistSelect = async (playlistId: string) => {
    setSelectedPlaylist(playlistId);
    console.log('playlistId', playlistId);
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlist tracks');
      }

      const data = await response.json();
      const songs = data.items.map((item: any) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        year: new Date(item.track.album.release_date).getFullYear(),
      }));

      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, songs } 
            : playlist
        )
      );
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  const handleGameLengthChange = (newLength: string) => {
    setGameLength(newLength);
  };

  const handleSubmit = () => {
    if (!gameId || !isFormValid || !isPlaylistValid) return;

    const selectedPlaylistData = playlists.find(p => p.id === selectedPlaylist);
    if (!selectedPlaylistData) return;

    setGameSettings({
      location,
      gameLength
    });
    setPlaylist(selectedPlaylistData.songs);
    setGameHasStarted(true);
    initializaPlayerDecks()

    // Navigate to gameplay
    router.push(`/protected/gameplay/${gameId}`);
  };

  return (
    <NewGameView
      playlists={playlists}
      gameId={gameId}
      currGameSettings={gameSettings}
      onLocationChange={handleLocationChange}
      onPlaylistSelect={handlePlaylistSelect}
      onGameLengthChange={handleGameLengthChange}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
      isPlaylistValid={isPlaylistValid}
      gameStarted={gameHasStarted}
      locationProp={location}
    />
  );
}