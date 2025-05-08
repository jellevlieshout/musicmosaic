"use client";

// Presenter
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import OngoingGamesView from "@/views/OngoingGamesView";

export type GameRow = {
  id: string;
  updated_at: string;
  current_players: any;
  current_playlist: any;
  game_settings: any;
};

export default function OngoingGamesPresenter() {
  const [games, setGames] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { 
            setLoading(false); 
            return; 
        }
      const { data, error } = await supabase
        .from("gameplay_states")
        .select("id, updated_at, current_players, current_playlist, game_settings")
        .eq("user_id", user.id)
        .eq("game_finished", false)
        .not("current_players", "is", null)

      if (!error && data) {
        const seen = new Set<string>();
        const unique: GameRow[] = [];

  for (const g of data as GameRow[]) {
    const key = g.updated_at.slice(0, 19);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(g);
    }
  }
  setGames(unique);
    }
    setLoading(false);
    })();
  }, []);

  async function handleDelete(id: string) {
    await supabase.from("gameplay_states").delete().eq("id", id);
    setGames((g) => g.filter((x) => x.id !== id));
  }

  function handleContinue(id: string) {
    router.push(`/protected/gameplay/${id}`);
  }

  return (
    <OngoingGamesView
      games={games}
      loading={loading}
      onContinue={handleContinue}
      onDelete={handleDelete}
    />
  );
}