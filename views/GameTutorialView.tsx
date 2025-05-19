"use client";

import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface GameTutorialViewProps {
    gameId: string | null,
}

export default function GameTutorialView({
    gameId,
  }: GameTutorialViewProps) {

  return (
    <div className="max-w-4xl p-6">
      <h1 className="neon-tubes-styling text-5xl mb-8 text-center">Game rules</h1>
      
      <div className="space-y-6 text-center">
        <div>
            <h2 className="neon-tubes-styling text-2xl mb-6 text-center">Objective</h2>
            <p>
                To build the biggest music collection timeline. First player to fill their timeline wins!
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
                    your personal music library or a provided setlist.
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
                    Once locked in, the card is revealed. If the guess was correct, you get the card added to your timeline. If another
                    player successfully stole it, it is added to their timeline.
                </p>
                <br/>
                <p>
                    The game ends when the first person fills their timeline and wins. 
                </p>
            </div>
        </div>

        <Button className="mt-6">
          <Link href={`/protected/new-game/players?gameId=${gameId}`}>Get started</Link>
        </Button>
      </div>
    </div>
  );
}