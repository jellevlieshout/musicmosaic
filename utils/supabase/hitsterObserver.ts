import { createClient } from "@/utils/supabase/client";
import { useGameplayStore, GameplayState as StoreGameplayState } from "@/stores/hitsterModelStore";
import { GameSettings, Player, Song } from "../types";

// Define the database schema types
type GameplayState = {
  id: string;
  currentPlayers: Player[] | null;
  currentPlayerId: string | null;
  currentPlaylist: Song[] | null;
  currentSongId: string | null;
  gameSettings: GameSettings | null;
  updatedAt: string;
};

/**
 * Observer class that watches the Zustand store and persists changes to Supabase
 */
export class HitsterObserver {
  private supabase = createClient();
  private gameId: string;
  private unsubscribe: () => void;

  constructor(gameId: string) {
    this.gameId = gameId;
    this.unsubscribe = this.setupObserver();
  }

  /**
   * Set up the observer to watch for changes in the Zustand store
   */
  private setupObserver() {
    return useGameplayStore.subscribe((state: StoreGameplayState) => {
      this.persistState(state);
      // Only persist players if they exist and don't have IDs yet
      if (state.currentPlayers && state.currentPlayers.some(player => !player.id)) {
        this.persistPlayers(state.currentPlayers);
      }
    });
  }

  /**
   * Persist players to the players table
   */
  private async persistPlayers(players: Player[]) {
    try {
      // Insert players and get back the assigned IDs
      const { data, error } = await this.supabase
        .from('player')
        .insert(
          players.map(player => ({
            name: player.name,
            highest_score: player.highestScore,
            game_id: this.gameId,
            location: player.location,
            wins: player.wins,
          }))
        )
        .select();

      if (error) {
        console.error('Error persisting players:', error);
        return;
      }

      if (data) {
        // Update the store with the assigned IDs
        const playersWithIds = players.map((player, index) => ({
          ...player,
          id: data[index].id
        }));
        
        useGameplayStore.getState().updatePlayersWithIds(playersWithIds);
        console.log('Players persisted and updated with IDs successfully');
      }
    } catch (error) {
      console.error('Error in persistPlayers:', error);
    }
  }

  /**
   * Persist the current state to Supabase
   */
  private async persistState(state: StoreGameplayState) {
    try {
      const gameplayState: GameplayState = {
        id: this.gameId,
        currentPlayers: state.currentPlayers,
        currentPlayerId: state.currentPlayerId,
        currentPlaylist: state.currentPlaylist,
        currentSongId: state.currentSongId,
        gameSettings: state.gameSettings,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await this.supabase
        .from('gameplay_states')
        .upsert({
          id: gameplayState.id,
          current_players: gameplayState.currentPlayers,
          current_player_id: gameplayState.currentPlayerId,
          current_playlist: gameplayState.currentPlaylist,
          current_song_id: gameplayState.currentSongId,
          game_settings: gameplayState.gameSettings,
          updated_at: gameplayState.updatedAt
        }, { onConflict: 'id' });

      if (error) {
        console.error('Error persisting gameplay state:', error);
      } else {
        console.log('Gameplay state persisted successfully');
      }
    } catch (error) {
      console.error('Error in persistState:', error);
    }
  }

  /**
   * Clean up the observer when it's no longer needed
   */
  public cleanup() {
    this.unsubscribe();
  }
}

/**
 * Initialize the observer for a specific game
 * @param gameId The unique identifier for the game
 * @returns The observer instance
 */
export function initializeHitsterObserver(gameId: string): HitsterObserver {
  return new HitsterObserver(gameId);
} 