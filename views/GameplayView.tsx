import GameCard from "@/components/GameCard";
import Timeline from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { GameSettings, Player, Song } from "@/utils/types";
import { Pause, Play, Square, StopCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
import { useGameplayStore } from "@/stores/hitsterModelStore";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

interface GameplayProps {
  currentPlayers: Player[] | null,
  currentPlayerId: string | null,
  currentPlaylist: Song[] | null, 
  currentSongId: string | null, 
  gameSettings: GameSettings | null,
  isAudioPlayerRunning: boolean,
  isLoading: boolean,
  error: string | null,
  startPlayer: () => void,
  stopPlayer: () => void,
  addCardToPlayersDeck: () => void,
  goToNextPlayer: () => void,
  playRandomNewSongFromCurrentPlaylist: () => void,
  setCurrentSongId: (songId: string | null) => void,
  setCurrentPlayers: (players: Player[] | null) => void,
}

export default function GameplayView({
  currentPlayers,
  currentPlayerId,
  currentPlaylist,
  currentSongId,
  gameSettings,
  isAudioPlayerRunning,
  isLoading,
  error,
  startPlayer,
  stopPlayer,
  addCardToPlayersDeck,
  goToNextPlayer,
  playRandomNewSongFromCurrentPlaylist,
  setCurrentSongId,
  setCurrentPlayers,
}: GameplayProps) {

  const [gameMessage, setGameMessage] = useState('Select a card')
  const [roundOver, setRoundOver] = useState(false)
  const [winner, setWinner] = useState<Player | undefined>(undefined)
  const [openPause, setOpenPause] = useState(false);
  const router = useRouter();

  // Zustand actions
  const pauseGame = useGameplayStore((s) => s.pauseGame);
  const resumeGame = useGameplayStore((s) => s.resumeGame);
  const restartGame = useGameplayStore((s) => s.restartGame);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (currentSongId) {
        setGameMessage('Select place in timeline')
    } else if (!currentSongId && !roundOver) {
        setGameMessage('Select a card')
    }

    // check if game is over
    if (gameSettings?.gameLength && currentPlayers?.find((play: Player) => (play.deck.length - 1) >= +gameSettings.gameLength)) {
        setWinner(currentPlayers?.find((play: Player) => (play.deck.length - 1) >= +gameSettings.gameLength));
    }
  }, [currentSongId])

  const getSongTitleById = (songId: string | null) => {
    if (!songId) return null;
    const song = currentPlaylist?.find((song: Song) => song.id === songId);
    return song ? song.title : null; // Return the song title or null if not found
  }
  const currentSongTitle = getSongTitleById(currentSongId)

  const getSongYearById = (songId: string | null) => {
      if (!songId) return null;
      const song = currentPlaylist?.find((song: Song) => song.id === songId);
      return song ? song.year : null; // Return the song title or null if not found
  }
  const currentSongYear = getSongYearById(currentSongId)

  function handleCardPick(evt: React.MouseEvent<any>) {
    playRandomNewSongFromCurrentPlaylist()
    setGameMessage('Click play to hear the song, then drag it to its position in the timeline')
  }

  function handlePlayPause() {
    if (isAudioPlayerRunning) {
      stopPlayer()
    } else {
      startPlayer()
    }
  }

  function handleStopClick(evt: React.MouseEvent<HTMLButtonElement>) {
    stopPlayer()
  }

  function confirmPlacement(correct: boolean) {
    stopPlayer()
    if (correct) {
        addCardToPlayersDeck()
        setGameMessage('Correct!')
        setCurrentSongId(null)
    } else {
        setGameMessage(`Incorrect! The song was: ${currentSongTitle} (${currentSongYear})`)
        setCurrentSongId(null)
    }
    setRoundOver(true)
  }

  function nextPlayer() {
    goToNextPlayer()
    setGameMessage('Select a card')
    setRoundOver(false)
  }

  function openPauseDialog() {
        pauseGame();
        setOpenPause(true);
  }

  function handleResume() {
        resumeGame();
        setOpenPause(false);
  }

  function handleRestart() {
        restartGame();
        setOpenPause(false);
  }

  function handleQuit() {
      router.push("/protected/home");
  }

  function handleCardPlacement(prevIndex: number, nextIndex: number) {
    // Get the current player's deck
    const currentPlayer = currentPlayers?.find((p) => currentPlayerId === p.id);
    if (!currentPlayer || !currentSongId || !currentPlaylist || !currentPlayers) return;

    const currentSong = currentPlaylist.find(song => song.id === currentSongId);
    if (!currentSong) return;

    // Create a new deck with the card inserted at the correct position
    const newDeck = [...currentPlayer.deck];
    newDeck.splice(nextIndex, 0, currentSong);

    // Update the player's deck
    const updatedPlayers = currentPlayers.map(p => 
      p.id === currentPlayerId 
        ? { ...p, deck: newDeck }
        : p
    );

    // Update the game state with the new players array
    setCurrentPlayers(updatedPlayers);
    setCurrentSongId(null);
    setGameMessage('Confirm the placement or drag the card to a different position');
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!currentPlayers) return;
    
    if (over && active.id !== over.id) {
      // Extract the index from the drop zone ID
      const dropZoneId = over.id as string;
      const index = parseInt(dropZoneId.split('-')[2]);
      
      // Get the current player's deck
      const currentPlayer = currentPlayers.find((p) => currentPlayerId === p.id);
      const deck = currentPlayer?.deck || [];
      
      // Place the card in the timeline
      const prevIndex = isNaN(index) ? deck.length - 1 : index - 1;
      const nextIndex = isNaN(index) ? deck.length : index;
      
      handleCardPlacement(prevIndex, nextIndex);
    }
  }

  if (isLoading) {
    return <div>Loading game...</div>;
  }

  if (error) {
    return <div>Error loading game: {error}</div>;
  }

  if (winner !== undefined) {
    return (
        <div className="flex flex-col w-screen p-6 gap-6 items-center">
            <p className="neon-tubes-styling text-8xl">{winner.name} wins!</p>
            <p className="neon-tubes-styling text-2xl">Final Scores:</p>
            {currentPlayers?.sort((p1, p2) => p2.deck.length - p1.deck.length).map((player: Player) => (
                <div key={player.id} className="flex flex-row justify-between" style={{width: '200px'}}>
                    <div>
                        {player.name}
                    </div>
                    <div>
                        {player.deck.length - 1}
                    </div>
                </div>
            ))}
            <Button asChild size="lg" variant="secondary">
              <Link href="/protected/new-game">New game</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
                <Link href="/protected/leaderboard">View rankings</Link>
            </Button>
        </div>
    )
  }
 
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-5 gap-4 w-screen">
        <div className="col-span-1 p-4 border-r">
          {currentPlayers?.map((player: Player) => (
            <div key={player.id} className="flex flex-row justify-between"  style={{ fontWeight: player.id === currentPlayerId ? 'bold' : 'normal' }}>
                <div>
                    {player.name}
                </div>
                <div>
                    {player.deck.length - 1}
                </div>
            </div>
          ))}
        </div>
        <div className="col-span-4 p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="neon-tubes-styling text-8xl">{currentPlayers?.find((p) => currentPlayerId === p.id)?.name}'s turn</p>
            <p className="neon-tubes-styling text-4xl">{gameMessage}</p>
            {!currentSongId && !roundOver && (
              <div onClick={handleCardPick}>
                <GameCard id="current-song" />
              </div>
            )}
            {currentSongId && !roundOver && (
              <div>
                <GameCard 
                  id="current-song" 
                  isRevealed={false} 
                  song={currentPlaylist?.find((song) => currentSongId === song.id)}
                  isDraggable={true}
                  isPlaying={isAudioPlayerRunning}
                  onPlayPause={handlePlayPause}
                />
              </div>
            )}
            {!currentSongId && roundOver && (
              <Button variant={"secondary"} onClick={nextPlayer}>
                Next Player
              </Button>
            )}
            {isAudioPlayerRunning && (
              <Button size="sm" variant={"secondary"} onClick={handleStopClick}>
                <p className="neon-tubes-styling">stop music</p>
              </Button>
            )}
            {!isAudioPlayerRunning && currentSongId && (
              <Button size="sm" variant={"secondary"} onClick={handlePlayPause}>
                <p className="neon-tubes-styling">{isAudioPlayerRunning ? 'pause' : 'play'}</p>
              </Button>
            )}

            <Button
              size="icon"
              variant="ghost"
              onClick={openPauseDialog}
              className="absolute top-4 right-4"
            >
              <Pause />
            </Button>
            <Dialog open={openPause} onOpenChange={setOpenPause}>
              <DialogContent className="max-w-[300px] text-center">
                <DialogHeader>
                  <DialogTitle className="neon-tubes-styling text-2xl">
                    Game paused
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-4">
                  <Button onClick={handleResume}>Resume</Button>
                  <Button variant="secondary" onClick={handleRestart}>
                    Restart
                  </Button>
                  <Button variant="destructive" onClick={handleQuit}>
                    Quit
                  </Button>
                </div>

                <DialogFooter />
              </DialogContent>
            </Dialog>
            <Timeline 
                currentSong={currentPlaylist?.find((song) => currentSongId === song.id)} 
                deck={currentPlayers?.find((play) => currentPlayerId === play.id)?.deck}
                confirmPlacement={confirmPlacement}
                onCardPlacement={handleCardPlacement}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}