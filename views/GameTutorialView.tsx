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
import Link from 'next/link';

export default function GameTutorialView() {

  return (
    <div className="max-w-4xl p-6">
      <h1 className="neon-tubes-styling text-5xl mb-8 text-center">Game rules</h1>
      
      <div className="space-y-6 text-center">
        <div>
            <h2 className="neon-tubes-styling text-2xl mb-6 text-center">Objective</h2>
            <p>
                Each player takes a turn listening to a song and deciding where in their music timeline that song 
                falls. For every correct guess, the player gets to keep that song and slowly build a bigger collection of music. 
                The first player to reach the winning number of cards is the winner. 
            </p>
        </div>
        <div>
            <h2 className="neon-tubes-styling text-2xl mb-6 text-center">Setup</h2>
            <div>
                <p>
                    First add each player in the player selection window. Players can play individually or
                    in teams. 
                </p>
                <br/>
                <p>
                    Then decide game settings like duration, location, and playlist. You can either use a playlist from 
                    your personal music library or a provided setlist. There are also additional game modifications like steal mode
                    and a song name bonus.
                </p>
                <br/>
                <p>
                    Before the game starts, each player will be randomly dealt a song from the deck to start their timeline. 
                </p>
            </div>
        </div>

        <div>
            <h2 className="neon-tubes-styling text-2xl mb-6 text-center">Gameplay</h2>
            <div>
                <p>
                    Pick a card and listen to the track.
                </p>
                <br/>
                <p>
                    Select where in your timeline you think the song belongs. If you are playing
                    with the song name bonus, you should also clearly state what you think the song is called for everyone to hear.
                    In steal mode, other players then have the option to place one of their steal tokens where they think the song 
                    actually belongs.
                </p>
                <br/>
                <p>
                    Once locked in, the card is revealed. If the guess was correct, you get the card added to your timeline. If another
                    player successfully stole it, it is added to their timeline. 
                </p>
            </div>
        </div>

        <Button className="mt-6">
          <Link href="/protected/new-game">Get started</Link>
        </Button>
      </div>
    </div>
  );
}