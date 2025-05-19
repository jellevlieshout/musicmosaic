"use client";

import { FinishedGame } from "@/app/protected/previous-games/page";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  games: FinishedGame[];
  loading: boolean;
}

export default function PreviousGamesView({ games, loading }: Props) {
  const router = useRouter();

  if (loading) return <div className="p-6">Loading…</div>;

  function prettyWinner(raw: any) {
    if (!raw){
        return "—";
    }
    if (raw.trim().startsWith("[")) {
      try {
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.join(", ") : String(arr);
      } catch {

      }
    }
    return raw;
  }

  return (
    <div className="max-w-lg mx-auto p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/")} 
          className="text-sm self-start"
        >
          ← Back
        </Button>
        <h1 className="neon-tubes-styling text-4xl text-center">Previous games</h1>
      </div>

      {games.length === 0 && <p>No finished games yet.</p>}

      {games.map((g) => {
        const [open, setOpen] = useState(false);

        // räkna fram vinnare
        let winner = "—";
        let scoreMap: { name: string; score: number }[] = [];
        if (Array.isArray(g.current_players) && g.current_players.length) {
          scoreMap = g.current_players.map((p: any) => ({
            name: p.name,
            score: (p.deck?.length || 1) - 1,
          }));
          const max = Math.max(...scoreMap.map((s) => s.score));
          winner = scoreMap.filter((s) => s.score === max).map((s) => s.name).join(", ");
        }

        return (
          <div key={g.id} className="border p-3 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Game #{g.id}</span>
              <Button size="sm" variant="secondary" onClick={() => setOpen(!open)}>
                {open ? "Hide" : "Details"}
              </Button>
            </div>

            {open && (
              <div className="mt-2 text-sm flex flex-col gap-1">
                {g.ended_at && (
                  <span>Date: {new Date(g.ended_at).toLocaleString()}</span>
                )}
                <span>
                Winner: {prettyWinner(g.game_winner) || "—"}
                </span>
              </div>
            )}
          </div>
        );
      })}
     </div>
   );
 }