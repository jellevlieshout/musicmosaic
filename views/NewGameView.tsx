"use client";

import { useEffect, useState } from 'react';
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
import { Song, Playlist, GameSettings } from '@/utils/types';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getUserLocation } from '@/utils/locationApi';
import Link from 'next/link';

interface NewGameViewProps {
  gameId: string | null,
  playlists: Playlist[];
  currGameSettings?: GameSettings | null;
  onLocationChange: (location: string) => void;
  onPlaylistSelect: (playlistId: string) => void;
  onAllowStealsChange: (allowSteals: boolean) => void;
  onGameLengthChange: (gameLength: string) => void;
  onSubmit: () => void;
  isFormValid: boolean;
  isPlaylistValid: boolean;
  gameStarted: boolean;
  locationProp: string;
}

export default function NewGameView({
  gameId,
  playlists,
  currGameSettings,
  onLocationChange,
  onPlaylistSelect,
  onAllowStealsChange,
  onGameLengthChange,
  onSubmit,
  isFormValid,
  isPlaylistValid,
  gameStarted,
  locationProp
}: NewGameViewProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [allowSteals, setAllowSteals] = useState(currGameSettings?.allowSteals ?? false);
  const [gameLength, setGameLength] = useState(currGameSettings?.gameLength ?? '');
  const [location, setLocation] = useState(locationProp ?? '');

  useEffect(() => {
    if (currGameSettings && currGameSettings.location) {
      setLocation(currGameSettings.location);
    }
    if (currGameSettings && currGameSettings.allowSteals) {
      setAllowSteals(currGameSettings.allowSteals);
    }
    if (currGameSettings && currGameSettings.gameLength) {
      setGameLength(currGameSettings.gameLength);
    }
    if (locationProp && locationProp !== location) {
      setLocation(locationProp);
    }
  }, [currGameSettings, locationProp]);
  

  

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
              onLocationChange(e.target.value);
            }}
            className="neon-glow-box-shadow"
            disabled={gameStarted}
          />
        </div>

        <div className="space-y-2">
          <Label className="neon-tubes-styling">Select playlist</Label>
          <Select
            value={selectedPlaylist}
            onValueChange={(value: string) => {
              setSelectedPlaylist(value);
              onPlaylistSelect(value);
            }}
            disabled={gameStarted}
          >
            <SelectTrigger className="neon-glow-box-shadow">
              <SelectValue placeholder="Choose a playlist" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {playlists.map((playlist) => (
                <SelectItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Label className="neon-tubes-styling">Allow steals?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} color="#3b3b3b"></Info>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    In steal mode, each player is given additional steal tokens they can use to steal a misplaced card
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            checked={allowSteals}
            onCheckedChange={(checked) => {
              setAllowSteals(checked);
              onAllowStealsChange(checked);
            }}
            disabled={gameStarted}
          />
        </div>

        <div className="space-y-2">
          <Label className="neon-tubes-styling">Select game length</Label>
          <Select
            value={gameLength}
            onValueChange={(value: string) => {
              setGameLength(value);
              onGameLengthChange(value);
            }}
            disabled={gameStarted}
          >
            <SelectTrigger className="neon-glow-box-shadow">
              <SelectValue placeholder="Songs per player" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem key={3} value={'3'}>
                  Quick game - 3 cards to win
                </SelectItem>
                <SelectItem key={5} value={'5'}>
                  Short game - 5 cards to win
                </SelectItem>
                <SelectItem key={10} value={'10'}>
                  Standard game - 10 cards to win
                </SelectItem>
                <SelectItem key={15} value={'15'}>
                  Long game - 15 cards to win
                </SelectItem>
            </SelectContent>
          </Select>
          {!isPlaylistValid && <div className='flex flex-row justify-between'>
                <p className='text-xs'>Playlist not long enough for selected game length!</p>
            </div>}
        </div>

        <div className='flex flex-row justify-between'>
            <Link href={`/protected/new-game/players?gameId=${gameId}`}>
                <Button
                    variant="outline"
                    className="neon-glow-box-shadow"
                >
                ← Back
                </Button>
            </Link>

            {!gameStarted && <Button
                onClick={onSubmit}
                disabled={!isFormValid && !isPlaylistValid}
                className={`${isFormValid && isPlaylistValid ? 'text-black' : 'opacity-50'}`}
            >
                Start →
            </Button>}
            {gameStarted && <Link href={`/protected/gameplay/${gameId}`}>
              <Button>
                  Resume →
              </Button>
            </Link>}
        </div>

        
      </div>
    </div>
  );
}