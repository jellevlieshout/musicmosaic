
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

export type Playlist = {
    id: string
    name: string
    songs: Song[]
}

export type GameSettings = {
    location: string
    allowSteals: boolean
    songNameBonus: boolean
    gameLength: string
}