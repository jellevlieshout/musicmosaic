"use client";

import { useState } from 'react';
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
import { Song, Playlist } from '@/utils/types';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface NewGameViewProps {
  playlists: Playlist[];
  onLocationChange: (location: string) => void;
  onPlaylistSelect: (playlistId: string) => void;
  onAllowStealsChange: (allowSteals: boolean) => void;
  onSongNameBonusChange: (songNameBonus: boolean) => void;
  onGameLengthChange: (gameLength: string) => void;
  onSubmit: () => void;
  isFormValid: boolean;
}

export default function NewGameView({
  playlists,
  onLocationChange,
  onPlaylistSelect,
  onAllowStealsChange,
  onSongNameBonusChange,
  onGameLengthChange,
  onSubmit,
  isFormValid
}: NewGameViewProps) {
  const [location, setLocation] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [allowSteals, setAllowSteals] = useState(false);
  const [songNameBonus, setSongNameBonus] = useState(false);
  const [gameLength, setGameLength] = useState('');

  // Game length options
  const gameLengthOptions = Array.from({ length: 16 }, (_, i) => i + 5);

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
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Label className="neon-tubes-styling">Song name bonus?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} color="#3b3b3b"></Info>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    If activated, players can earn extra points for correctly guessing the name of the selected track
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            checked={songNameBonus}
            onCheckedChange={(checked) => {
              setSongNameBonus(checked);
              onSongNameBonusChange(checked);
            }}
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
        </div>
        <div className='flex flex-row justify-between'>
            <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="neon-glow-box-shadow"
            >
            ← Back
            </Button>
            <Button
                onClick={onSubmit}
                disabled={!isFormValid}
                className={`${isFormValid ? 'text-black' : 'opacity-50'}`}
            >
                Next →
            </Button>
        </div>
        
      </div>
    </div>
  );
}