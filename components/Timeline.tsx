import { Song } from "@/utils/types"
import GameCard from "./GameCard"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

interface TimelineProps {
    currentSong?: Song | undefined,
    deck: Song[] | undefined,
    confirmPlacement?: (correct: boolean) => void,
    readOnly?: boolean,
}

interface InsertLocation {
    prevSong?: Song,
    prevIndex?: number,
    nextSong?: Song,
    nextIndex?: number,
}

export default function Timeline({
    currentSong,
    deck,
    confirmPlacement,
    readOnly = false,
} : TimelineProps) {

    const [insertLocation, setIntsertLocation] = useState<InsertLocation | null>(null)

    function placeCardInTimeline(prevIndex: number, nextIndex: number) {
        const newLoc: InsertLocation = {}
        if (deck?.at(prevIndex) && prevIndex >= 0) {  
            newLoc.prevSong = deck.at(prevIndex)
            newLoc.prevIndex = prevIndex
        }
        if (deck?.at(nextIndex)) {  
            newLoc.nextSong = deck.at(nextIndex)
            newLoc.nextIndex = nextIndex
        }
        setIntsertLocation(newLoc)
    }

    function confirm() {
        if (confirmPlacement)
            confirmPlacement(checkPlacement())
        setIntsertLocation(null)
    }

    function checkPlacement() {
        console.log(insertLocation)
        if (currentSong?.year === undefined) return false
        if (insertLocation?.prevSong?.year && insertLocation?.prevSong?.year > currentSong?.year) return false
        if (insertLocation?.nextSong?.year && insertLocation?.nextSong?.year < currentSong?.year) return false
        return true
    }

    return (
        <div className="overflow-x-auto flex flex-row justify-center items-center w-full gap-6" style={{height: '300px'}}>
            {deck && deck.map((song: Song, index: number) => (
                <>
                    {currentSong && insertLocation?.nextIndex !== index &&
                        <Button size="sm" variant={"ghost"} onClick={() => placeCardInTimeline(index - 1, index)}>
                            <Plus/>
                        </Button>}
                    {insertLocation && insertLocation.nextIndex === index &&
                        <GameCard isPlaced song={currentSong} confirmPlacement={confirm}></GameCard>
                    }
                    <GameCard isRevealed song={song}></GameCard>
                    {index === deck.length - 1 && insertLocation && insertLocation.prevIndex === index &&
                        <GameCard isPlaced song={currentSong} confirmPlacement={confirm}></GameCard>
                    }
                    {currentSong && index === deck.length - 1 && insertLocation?.prevIndex !== index && 
                        <Button size="sm" variant={"ghost"} onClick={() => placeCardInTimeline(index, index + 1)}>
                            <Plus/>
                        </Button>
                    }
                </>

            ))}
        </div>
    )
}