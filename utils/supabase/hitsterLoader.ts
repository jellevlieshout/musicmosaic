import { createClient } from "@/utils/supabase/client";
import { useGameplayStore } from "@/stores/hitsterModelStore";

/**
 * Load a game state from Supabase and update the Zustand store
 * @param gameId The unique identifier for the game, or null to create a new game
 * @returns A promise that resolves with the game ID when the state is loaded
 */
export async function loadGameState(gameId: string | null): Promise<string> {
  const supabase = createClient();

  /* 1. aktuell användare */
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  if (!user) throw new Error("No signed‑in user");

  let data: any;

  if (gameId) {
    /* Continue‑flödet */
    const { data: existing, error } = await supabase
      .from("gameplay_states")
      .select("*")
      .eq("id", gameId)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    if (!existing) throw new Error("Game not found");
    data = existing;
  } else {
    /* New‑game – återanvänd rad om den inte är avslutad */
    const { data: newGame, error: insertErr } = await supabase
    .from("gameplay_states")
    .insert({ game_finished: false })
    .select()
    .single();

    if (insertErr) throw insertErr;
    if (!newGame) throw new Error("Failed to create new game");

    useGameplayStore.getState().resetModel();
    data = newGame;
  }
    
    // Update the Zustand store with the loaded state
    const { setPlaylist, seatPlayersInRandomOrder, setGameSettings, setGameHasStarted } = useGameplayStore.getState();
    
    // Set the playlist if it exists
    if (data.current_playlist) {
      setPlaylist(data.current_playlist);
    }
    
    // Set the players if they exist
    if (data.current_players) {
      seatPlayersInRandomOrder(data.current_players);
    }
    
    // Set the current song ID if it exists
    if (data.current_song_id) {
      useGameplayStore.setState({ currentSongId: data.current_song_id });
    }

    // Set the game settings if they exist
    if (data.game_settings) {
      setGameSettings(data.game_settings);
    }

    // Set the game has started if it exists
    if (data.game_started) {
      setGameHasStarted(data.game_started);
    }
    
    return data.id;
  }