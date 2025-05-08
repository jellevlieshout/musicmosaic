// app/(protected)/previous-games/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import PreviousGamesView from "@/views/PreviousGamesView";

export type FinishedGame = {
  id: string;
  ended_at: string;
  game_settings: any;
  current_players: string;
  game_winner: string[] | null;
};

export default function PreviousGamesPresenter() {
  const [games, setGames] = useState<FinishedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("gameplay_states")
        .select("id, ended_at, game_winner, game_settings")
        .eq("user_id", user.id)
        .eq("game_finished", true)
        .order("ended_at", { ascending: true });

if (!error && data) {
  // some duplication prevention
  const seen = new Set<string>();
  const unique = [];

  for (const g of data as FinishedGame[]) {
    const key = g.ended_at?.slice(0, 19); // YYYY-MM-DDTHH:MM:SS
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

  return <PreviousGamesView 
  games={games} 
  loading={loading} 
  />;
}
