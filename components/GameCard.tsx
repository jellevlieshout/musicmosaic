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
}

export default function GameCard({
    isRevealed,
    isPlaced,
    song,
    confirmPlacement,
} : GameCardProps) {

    if (!isRevealed || song === undefined) {
        return (
            <div 
                className="neon-glow-box-shadow_default flex flex-col items-center justify-center gap-1" 
                style={{ height: '150px', width: '150px', borderRadius: '5px', backgroundColor: '#101013'}}>
                <div className="neon-tubes-styling text-6xl">MM</div>
                {isPlaced && <Button size="sm" variant={"secondary"} onClick={confirmPlacement}>
                    Confirm
                </Button>}
            </div>
        )
    }

    return (
        <div 
            className="neon-glow-box-shadow_default flex flex-col items-center justify-center gap-1" 
            style={{ height: '150px', width: '150px', borderRadius: '5px', backgroundColor: '#101013'}}>
            <div className="neon-tubes-styling text-5xl text-center">{song.year}</div>
            <div className="text-l text-center">{truncateText(song.title, 15)}</div>
            <div className="text-l text-center">{song.artist}</div>
        </div>
    )
}