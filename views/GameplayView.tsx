import GameCard from "@/components/GameCard";
import Timeline from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { GameSettings, Player, Song } from "@/utils/types";
import { Pause, Play, Square, StopCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
}: GameplayProps) {

  const [gameMessage, setGameMessage] = useState('Select a card')
  const [roundOver, setRoundOver] = useState(false)
  const [winner, setWinner] = useState<Player | undefined>(undefined)

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
    setGameMessage('')
  }

  function handlePlayClick(evt: React.MouseEvent<any>) {
    startPlayer()
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
        setGameMessage('Incorrect!')
        setCurrentSongId(null)
    }
    setRoundOver(true)
  }

  function nextPlayer() {
    goToNextPlayer()
    setGameMessage('Select a card')
    setRoundOver(false)
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
    <>
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
            {!currentSongId && !roundOver && <div onClick={handleCardPick}>
              <GameCard />
            </div>}
            {isAudioPlayerRunning && (
                <Button size="sm" variant={"secondary"} onClick={handleStopClick}>
                    <p className="neon-tubes-styling">stop music</p>
                </Button>
            )}
            {isAudioPlayerRunning && currentSongId && currentSongTitle && (
                <div>
                    We are playing the song with ID {currentSongId}, song {currentSongTitle}
                </div>
            )}
            {!isAudioPlayerRunning && currentSongId && (
                <Button size="sm" variant={"secondary"} onClick={handlePlayClick}>
                <p className="neon-tubes-styling">play again</p>
                </Button>
            )}
            {!currentSongId && roundOver && (
              <Button variant={"secondary"} onClick={nextPlayer}>
                Next Player
              </Button>
            )}
            <Timeline 
                currentSong={currentPlaylist?.find((song) => currentSongId === song.id)} 
                deck={currentPlayers?.find((play) => currentPlayerId === play.id)?.deck}
                confirmPlacement={confirmPlacement}
            ></Timeline>
          </div>
        </div>
      </div>
    </>
  );
}