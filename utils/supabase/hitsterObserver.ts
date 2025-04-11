import { createClient } from "@/utils/supabase/client";
import { Player, Song, useGameplayStore, GameplayState as StoreGameplayState } from "@/stores/hitsterModelStore";

// Define the database schema types
type GameplayState = {
  id: string;
  currentPlayers: Player[] | null;
  currentPlayerId: string | null;
  currentPlaylist: Song[] | null;
  currentSongId: string | null;
  gameSettings: {
    location: string;
    allowSteals: boolean;
    songNameBonus: boolean;
    gameLength: string;
  } | null;
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
    });
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