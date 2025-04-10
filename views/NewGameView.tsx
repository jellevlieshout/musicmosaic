"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGameplayStore, type Song } from '@/stores/hitsterModelStore';

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export default function NewGameView() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [allowSteals, setAllowSteals] = useState(false);
  const [songNameBonus, setSongNameBonus] = useState(false);
  const [gameLength, setGameLength] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Get the setPlaylist function from the store
  const setPlaylist = useGameplayStore((state) => state.setPlaylist);

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

  // Game length options
  const gameLengthOptions = Array.from({ length: 16 }, (_, i) => i + 5);

  const validateForm = () => {
    const isValid = location !== '' && 
                   selectedPlaylist !== '' && 
                   gameLength !== '';
    setIsFormValid(isValid);
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    // Find the selected playlist
    const selectedPlaylistData = playlists.find(p => p.id === selectedPlaylist);
    if (!selectedPlaylistData) return;

    // Save game settings to the store
    setPlaylist(selectedPlaylistData.songs);

    // Navigate to gameplay
    router.push('/protected/gameplay');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="neon-tubes-styling text-5xl mb-8 text-center">NEW GAME</h1>
      <h2 className="neon-tubes-styling text-2xl mb-6 text-center">GAME SETTINGS</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="neon-tubes-styling">Location</Label>
          <Input
            placeholder="Stockholm, Sweden"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              validateForm();
            }}
            className="neon-glow-box-shadow"
          />
        </div>

        <div className="space-y-2">
          <Label className="neon-tubes-styling">Select playlist</Label>
          <Select
            value={selectedPlaylist}
            onValueChange={(value: string) => {
              setSelectedPlaylist(value);
              validateForm();
            }}
          >
            <SelectTrigger className="neon-glow-box-shadow">
              <SelectValue placeholder="Choose a playlist" />
            </SelectTrigger>
            <SelectContent>
              {playlists.map((playlist) => (
                <SelectItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="neon-tubes-styling">Allow steals?</Label>
          <Switch
            checked={allowSteals}
            onCheckedChange={setAllowSteals}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="neon-tubes-styling">Song name bonus?</Label>
          <Switch
            checked={songNameBonus}
            onCheckedChange={setSongNameBonus}
          />
        </div>

        <div className="space-y-2">
          <Label className="neon-tubes-styling">Select game length</Label>
          <Select
            value={gameLength}
            onValueChange={(value: string) => {
              setGameLength(value);
              validateForm();
            }}
          >
            <SelectTrigger className="neon-glow-box-shadow">
              <SelectValue placeholder="Songs per player" />
            </SelectTrigger>
            <SelectContent>
              {gameLengthOptions.map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} songs per player
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className={`w-full mt-6 ${isFormValid ? 'neon-tubes-styling' : 'opacity-50'}`}
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Next
        </Button>
      </div>
    </div>
  );
}