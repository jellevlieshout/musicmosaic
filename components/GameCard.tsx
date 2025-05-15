import { Song } from "@/utils/types"
import { Button } from "./ui/button"
import { useDraggable } from '@dnd-kit/core';
import { Play, Pause } from "lucide-react";

interface GameCardProps {
    isRevealed?: boolean,
    isPlaced?: boolean,
    song?: Song,
    confirmPlacement?: () => void,
    id?: string,
    isDraggable?: boolean,
    isPlaying?: boolean,
    onPlayPause?: () => void,
}

export default function GameCard({
    isRevealed,
    isPlaced,
    song,
    confirmPlacement,
    id,
    isDraggable = false,
    isPlaying = false,
    onPlayPause,
} : GameCardProps) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: id || 'draggable-card',
        data: {
            song,
        },
        disabled: !isDraggable,
    });

    const transformStyle = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : 1,
    } : {};

    const baseStyle = {
        height: '150px',
        width: '150px',
        borderRadius: '5px',
        backgroundColor: '#101013',
        ...transformStyle
    };

    const dragProps = isDraggable ? {
        ref: setNodeRef,
        ...listeners,
        ...attributes,
        className: `neon-glow-box-shadow_default flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`,
    } : {
        className: "neon-glow-box-shadow_default flex flex-col items-center justify-center gap-1",
    };

    if (!isRevealed || song === undefined) {
        return (
            <div 
                {...dragProps}
                style={baseStyle}>
                <div className="neon-tubes-styling text-6xl">MM</div>
                {onPlayPause && (
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={onPlayPause}
                        className="mt-2"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </Button>
                )}
                {isPlaced && confirmPlacement && (
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={confirmPlacement}
                        className="mt-2"
                    >
                        Confirm
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div 
            {...dragProps}
            style={baseStyle}>
            <div className="neon-tubes-styling text-5xl text-center">{song.year}</div>
            <div className="text-l text-center">{song.title}</div>
            <div className="text-l text-center">{song.artist}</div>
        </div>
    )
}