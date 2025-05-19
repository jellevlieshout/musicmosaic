import GameCard from "@/components/GameCard";
import Timeline from "@/components/Timeline";
import AudioWave from "@/components/SineWave";
import { Button } from "@/components/ui/button";
import { GameSettings, Player, Song } from "@/utils/types";
import { Pause } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { ChevronDown } from "lucide-react";

interface GameplayProps {
  currentPlayers: Player[] | null,
  currentPlayerId: string | null,
  currentPlaylist: Song[] | null, 
  currentSongId: string | null, 
  gameSettings: GameSettings | null,
  isAudioPlayerRunning: boolean,
  isLoading: boolean,
  error: string | null,
  onStartPlayerClick: () => void,
  onStopPlayerClick: () => void,
  onCardSelect: () => void,
  onNextPlayerClick: () => void,
  onCorrectPlacement: () => void,
  onIncorrectPlacement: () => void,
  onPauseGameClick: () => void,
  onRestartGameClick: () => void,
  onResumeGameClick: () => void,
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
  onStartPlayerClick,
  onStopPlayerClick,
  onCardSelect,
  onNextPlayerClick,
  onCorrectPlacement,
  onIncorrectPlacement,
  onPauseGameClick,
  onRestartGameClick,
  onResumeGameClick,
}: GameplayProps) {

  const [gameMessage, setGameMessage] = useState('Select a card')
  const [roundOver, setRoundOver] = useState(false)
  const [winner, setWinner] = useState<Player | undefined>(undefined)
  const [openPause, setOpenPause] = useState(false);
  const router = useRouter();

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

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
  });

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

  const getSongArtistById = (songId: string | null) => {
    if (!songId) return null;
    const song = currentPlaylist?.find((song: Song) => song.id === songId);
    return song ? song.artist : null; // Return the song title or null if not found
  }
  const currentSongArtist = getSongArtistById(currentSongId)
  function cardPick(evt: React.MouseEvent<any>) {
    onCardSelect()
    setGameMessage('')
  }

  function playClick(evt: React.MouseEvent<any>) {
    onStartPlayerClick()
  }

  function stopClick(evt: React.MouseEvent<HTMLButtonElement>) {
    onStopPlayerClick()
  }

  function confirmPlacement(correct: boolean) {
    onStopPlayerClick()
    if (correct) {
        onCorrectPlacement()
        setGameMessage('Correct!')
    } else {
        onIncorrectPlacement()
        setGameMessage(`Incorrect! The song was: ${currentSongTitle} by ${currentSongArtist} (${currentSongYear})`)
    }
    setRoundOver(true)
  }

  function nextPlayer() {
    onNextPlayerClick()
    setGameMessage('Select a card')
    setRoundOver(false)
  }

  function openPauseDialog() {
        onPauseGameClick();
        setOpenPause(true);
  }

  function resumeGame() {
        onResumeGameClick();
        setOpenPause(false);
  }

  function restartGame() {
        onRestartGameClick();
        setOpenPause(false);
  }

  function quitGame() {
      router.push("/protected/home");
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
        {/* SIDOPANELEN */}
        <div className="col-span-1 p-4 border-r overflow-y-auto space-y-4">
  {currentPlayers?.map(player => {
    const isOpen = expanded.has(player.id);
    return (
      <div key={player.id}>
        {/* klickrad */}
        <button
          onClick={() => toggleExpand(player.id)}
          className={`
            flex w-full items-center justify-between mb-1 rounded
            text-left cursor-pointer select-none transition-colors
            hover:bg-neutral-800/60
            ${player.id === currentPlayerId ? "font-bold text-lime-300" : ""}
          `}
        >
          {/* namn + poäng till vänster */}
          <span className="flex-1">
            {player.name}
          </span>
          <span className="mr-1">{player.deck.length - 1}</span>

          {/* pilen */}
          <ChevronDown
            size={18}
            className={`
              transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* deck syns bara när raden är öppen */}
        {isOpen && (
          <div className="ml-2 flex flex-wrap gap-1 pb-2">
            {player.deck.map(song => (
              <GameCard key={song.id} song={song} isRevealed small />
            ))}
          </div>
        )}
      </div>
    );
  })}
</div>


        <div className="col-span-4 p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="neon-tubes-styling text-8xl">{currentPlayers?.find((p) => currentPlayerId === p.id)?.name}'s turn</p>
            <p className="neon-tubes-styling text-4xl">{gameMessage}</p>
            {!currentSongId && !roundOver && <div onClick={cardPick}>
              <GameCard />
            </div>}
            {currentSongId && currentSongTitle && (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-4">
                        <AudioWave color="#ff00ff" amplitude={12} frequency={0.04} speed={0.06} isPlaying={isAudioPlayerRunning} />
                        <div className={isAudioPlayerRunning ? "animate-pulse" : ""}>
                            <GameCard song={currentPlaylist?.find((song) => currentSongId === song.id)} />
                        </div>
                        <AudioWave color="#ff00ff" amplitude={12} frequency={0.04} speed={0.06} mirror isPlaying={isAudioPlayerRunning} />
                    </div>
                    <div>
                        {isAudioPlayerRunning ? (
                            <Button size="sm" variant={"secondary"} onClick={stopClick}>
                                <p className="neon-tubes-styling">stop music</p>
                            </Button>
                        ) : (
                            <Button size="sm" variant={"secondary"} onClick={playClick}>
                                <p className="neon-tubes-styling">play again</p>
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {!currentSongId && roundOver && (
              <Button variant={"secondary"} onClick={nextPlayer}>
                Next Player
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
                  <Button onClick={resumeGame}>Resume</Button>
                  <Button variant="secondary" onClick={restartGame}>
                    Restart
                  </Button>
                  <Button variant="destructive" onClick={quitGame}>
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
            ></Timeline>
          </div>
        </div>
      </div>
    </>
  );
}