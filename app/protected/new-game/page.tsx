"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NewGameView from "@/views/NewGameView";
import { useGameplayStore, type Song } from '@/stores/hitsterModelStore';
import { useHitsterPersistence } from '@/hooks/useHitsterPersistence';

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

  // Get the setPlaylist function from the store
  const setPlaylist = useGameplayStore((state) => state.setPlaylist);
  const setGameSettings = useGameplayStore((state) => state.setGameSettings);

  // Initialize a new game
  const { isLoading, error, gameId } = useHitsterPersistence(null);

  // Run validation whenever any of the form fields change
  useEffect(() => {
    validateForm();
  }, [location, selectedPlaylist, gameLength]);

  // Placeholder playlists - these should come from your backend/API
  const playlists: Playlist[] = [
    { id: '1', name: 'Top Hits 2024', songs: [
      { id: '1', title: 'Last Night', artist: 'Morgan Wallen', album: 'One Thing At A Time', year: 2023 },
      { id: '2', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', year: 2022 },
      { id: '3', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", year: 2022 },
    ]},
    { id: '2', name: '90s Classics', songs: [
      { id: '4', title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', year: 1991 },
      { id: '5', title: 'Wonderwall', artist: 'Oasis', album: "(What's the Story) Morning Glory?", year: 1995 },
      { id: '6', title: 'No Diggity', artist: 'Blackstreet', album: 'Another Level', year: 1996 },
    ]},
    { id: '3', name: 'Rock Legends', songs: [
      { id: '7', title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', year: 1971 },
      { id: '8', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', year: 1975 },
      { id: '9', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', year: 1987 },
    ]},
  ];

  const validateForm = () => {
    const isValid = location !== '' && 
                   selectedPlaylist !== '' && 
                   gameLength !== '';
    setIsFormValid(isValid);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylist(playlistId);
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
    
    // Find the selected playlist
    const selectedPlaylistData = playlists.find(p => p.id === selectedPlaylist);
    if (!selectedPlaylistData) return;

    // Save game settings to the store
    setGameSettings({
      location,
      allowSteals,
      songNameBonus,
      gameLength
    });
    setPlaylist(selectedPlaylistData.songs);

    // Navigate to gameplay with the game ID in the URL
    router.push(`/protected/gameplay/${gameId}`);
  };

  if (isLoading) {
    return <div>Creating new game...</div>;
  }

  if (error) {
    return <div>Error creating game: {error}</div>;
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