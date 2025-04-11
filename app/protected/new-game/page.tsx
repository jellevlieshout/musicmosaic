"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NewGameView from "@/views/NewGameView";
import { useGameplayStore, type Song } from '@/stores/hitsterModelStore';
import { useHitsterPersistence } from '@/hooks/useHitsterPersistence';
import { useSpotifyStore } from '@/stores/spotifyStore';

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export default function NewGamePresenter() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [allowSteals, setAllowSteals] = useState(false);
  const [songNameBonus, setSongNameBonus] = useState(false);
  const [gameLength, setGameLength] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);

  const accessToken = useSpotifyStore((state) => state.accessToken);
  const setPlaylist = useGameplayStore((state) => state.setPlaylist);
  const setGameSettings = useGameplayStore((state) => state.setGameSettings);
  const { isLoading, error, gameId } = useHitsterPersistence(null);

  useEffect(() => {
    if (accessToken) {
      console.log('accessToken', accessToken);
      console.log('gameId', gameId);
      fetchUserPlaylists();
    }
  }, [accessToken]);

  useEffect(() => {
    validateForm();
  }, [location, selectedPlaylist, gameLength]);

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const data = await response.json();
      const formattedPlaylists = data.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        songs: [], // We'll fetch songs when a playlist is selected
      }));

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

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handlePlaylistSelect = async (playlistId: string) => {
    setSelectedPlaylist(playlistId);
    
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

  const handleAllowStealsChange = (newValue: boolean) => {
    setAllowSteals(newValue);
  };

  const handleSongNameBonusChange = (newValue: boolean) => {
    setSongNameBonus(newValue);
  };

  const handleGameLengthChange = (newLength: string) => {
    setGameLength(newLength);
  };

  const handleSubmit = () => {
    if (!isFormValid || !gameId) return;
    
    const selectedPlaylistData = playlists.find(p => p.id === selectedPlaylist);
    if (!selectedPlaylistData) return;

    setGameSettings({
      location,
      allowSteals,
      songNameBonus,
      gameLength
    });
    setPlaylist(selectedPlaylistData.songs);

    router.push(`/protected/new-game/players?gameId=${gameId}`);
  };

  if (isLoading || isLoadingPlaylists) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <NewGameView
      playlists={playlists}
      onLocationChange={handleLocationChange}
      onPlaylistSelect={handlePlaylistSelect}
      onAllowStealsChange={handleAllowStealsChange}
      onSongNameBonusChange={handleSongNameBonusChange}
      onGameLengthChange={handleGameLengthChange}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
    />
  );
}