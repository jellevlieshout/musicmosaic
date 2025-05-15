import { Song } from "@/utils/types"
import GameCard from "./GameCard"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { useDroppable } from '@dnd-kit/core';

interface TimelineProps {
    currentSong: Song | undefined,
    deck: Song[] | undefined,
    confirmPlacement: (correct: boolean) => void,
    onCardPlacement?: (prevIndex: number, nextIndex: number) => void,
}

interface InsertLocation {
    prevIndex: number,
    nextIndex: number,
}

export default function Timeline({
    currentSong,
    deck,
    confirmPlacement,
    onCardPlacement,
} : TimelineProps) {
    const [insertLocation, setInsertLocation] = useState<InsertLocation | null>(null)
    const [isDraggingOver, setIsDraggingOver] = useState(false)

    const {setNodeRef, isOver} = useDroppable({
        id: 'timeline',
    });

    // Update isDraggingOver when isOver changes
    useEffect(() => {
        setIsDraggingOver(isOver);
    }, [isOver]);

    function placeCardInTimeline(prevIndex: number, nextIndex: number) {
        setInsertLocation({
            prevIndex,
            nextIndex,
        });
        onCardPlacement?.(prevIndex, nextIndex);
    }

    function confirm() {
        if (!insertLocation || !currentSong) return;
        
        // Check if the placement is correct
        const prevSong = deck?.[insertLocation.prevIndex];
        const nextSong = deck?.[insertLocation.nextIndex];
        
        const isCorrect = (
            (!prevSong || prevSong.year <= currentSong.year) &&
            (!nextSong || nextSong.year >= currentSong.year)
        );
        
        confirmPlacement(isCorrect);
        setInsertLocation(null);
    }

    return (
        <div 
            ref={setNodeRef}
            className="overflow-x-auto flex flex-row justify-center items-center w-full gap-6" 
            style={{height: '300px'}}>
            {deck && deck.map((song: Song, index: number) => (
                <div key={index} className="flex items-center">
                    {currentSong && insertLocation?.nextIndex !== index &&
                        <div 
                            className="h-8 w-8 flex items-center justify-center cursor-pointer"
                            onClick={() => placeCardInTimeline(index - 1, index)}
                        >
                            <Plus/>
                        </div>}
                    {insertLocation && insertLocation.nextIndex === index &&
                        <div className={`mx-4 transition-all duration-200 ${isDraggingOver ? 'scale-110' : ''}`}>
                            <GameCard 
                                isPlaced 
                                song={currentSong} 
                                confirmPlacement={confirm}
                                id={`drop-zone-${index}`}
                            />
                        </div>
                    }
                    <div className={`transition-all duration-200 ${isDraggingOver ? 'mx-4' : ''}`}>
                        <GameCard 
                            isRevealed 
                            song={song}
                            id={`card-${index}`}
                        />
                    </div>
                    {index === deck.length - 1 && insertLocation && insertLocation.prevIndex === index &&
                        <div className={`mx-4 transition-all duration-200 ${isDraggingOver ? 'scale-110' : ''}`}>
                            <GameCard 
                                isPlaced 
                                song={currentSong} 
                                confirmPlacement={confirm}
                                id={`drop-zone-end`}
                            />
                        </div>
                    }
                    {currentSong && index === deck.length - 1 && insertLocation?.prevIndex !== index && 
                        <div 
                            className="h-8 w-8 flex items-center justify-center cursor-pointer"
                            onClick={() => placeCardInTimeline(index, index + 1)}
                        >
                            <Plus/>
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}