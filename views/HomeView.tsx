"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NeonTitle from "@/components/NeonTitle";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Music } from "lucide-react";

interface HomeViewProps {
  isSpotifyConnected: boolean;
  onSpotifyConnect: () => void;
}

export default function HomeView({ isSpotifyConnected, onSpotifyConnect }: HomeViewProps) {
  return (
    <>
      <div className="items-center flex flex-col gap-5 py-8">
        <div className="mb-4">
          <NeonTitle />
        </div>
        <h1 className="neon-tubes-styling text-3xl mt-4">Welcome</h1>
        <div className="flex flex-col gap-3 mt-4">
          {!isSpotifyConnected ? (
            <Button
              size="lg"
              variant="secondary"
              onClick={onSpotifyConnect}
              className="flex items-center gap-2"
            >
              <Music className="w-5 h-5" />
              Connect with Spotify
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Music className="w-5 h-5" />
              <span>Connected to Spotify</span>
            </div>
          )}
          {isSpotifyConnected ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Button
                      size="lg"
                      variant="secondary"
                      disabled={!isSpotifyConnected}
                      className="w-full"
                    >
                      <Link href="/protected/new-game/tutorial">New game</Link>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Please connect to Spotify first to start a new game</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            // <Button asChild size="lg" variant="secondary">
            //   <Link href="/protected/new-game">New game</Link>
            // </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/protected/new-game/tutorial">New game</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="secondary">
            <Link href="/protected/leaderboard">View rankings</Link>
          </Button>
        </div>
      </div>
    </>
  );
}