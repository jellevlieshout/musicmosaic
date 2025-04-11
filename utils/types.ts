
export type Song = {
    id: string
    title: string
    artist: string
    album: string
    year: number
    hasBeenPlayed?: boolean
}

export type Player = {
    id: string
    name: string
    highestScore: number | null
    deck: Song[]
}