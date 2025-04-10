import { subscribeWithSelector } from 'zustand/middleware'
import { Player, Song } from '../../stores/hitsterModelStore' // Importera typer från din store
import { createClient } from './client'
const supabase = createClient() // create supabase object that can talk to supabase database

export async function upsertPlayers(players: Player[]) {
    const { data, error } = await supabase
      .from('player')
      .upsert(
        players.map((p) => ({
          id: p.id,
          name: p.name,
          highestScore: p.highestScore,
          deck: p.deck, // JSON-objekt/array (kräver kolumn av typen json eller jsonb)
        }))
      )
  
    return { data, error }
  }

  export async function upsertSongs(songs: Song[]) {
    const { data, error } = await supabase
      .from('song')
      .upsert(
        songs.map((s) => ({
          id: s.id,
          title: s.title,
          artist: s.artist,
          album: s.album,
          year: s.year,
          hasBeenPlayed: s.hasBeenPlayed ?? false,
        }))
      )
  
    return { data, error }
  }
