import { Song } from "@/utils/types"
import { Button } from "./ui/button"

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

interface GameCardProps {
    isRevealed?: boolean,
    isPlaced?: boolean,
    song?: Song,
    confirmPlacement?: () => void,
    small?:boolean
}

export default function GameCard({
    isRevealed,
    isPlaced,
    song,
    confirmPlacement,
    small = false,          // ← finns redan
  }: GameCardProps) {
  
    const size = small ? "w-16 h-20 text-[10px]" : "w-[150px] h-[150px]";
    const cardClass =
      `neon-glow-box-shadow_default flex flex-col items-center justify-center gap-1 ${size}`;
  
    /* ★ NYTT: villkorlig höjd/bredd */
    const cardStyle = {
      height: small ? "80px" : "150px",
      width:  small ? "80px" : "150px",
      borderRadius: "5px",
      backgroundColor: "#101013",
    };
  
    /* ----------- resten orört ----------- */
    if (!isRevealed || song === undefined) {
      return (
        <div className={cardClass} style={cardStyle}>
          <div className="neon-tubes-styling text-6xl">MM</div>
          {isPlaced && !small && (
            <Button size="sm" variant="secondary" onClick={confirmPlacement}>
              Confirm
            </Button>
          )}
        </div>
      );
    }
  
    return (
      <div className={cardClass} style={cardStyle}>
        <div className={small
          ? "neon-tubes-styling text-lg text-center"
          : "neon-tubes-styling text-5xl text-center"}
        >
          {song.year}
        </div>
  
        <div className={small ? "text-[9px] text-center" : "text-l text-center"}>
          {truncateText(song.title, small ? 8 : 15)}
        </div>
  
        <div className="text-l text-center">{song.artist}</div>
      </div>
    );
  }
  