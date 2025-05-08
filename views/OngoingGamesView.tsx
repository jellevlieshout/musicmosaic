"use client";
import { GameRow } from "@/app/protected/ongoing-games/page";
import { Button } from "@/components/ui/button";

interface Props {
  games: GameRow[];
  loading: boolean;
  onContinue: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OngoingGamesView({ games, loading, onContinue, onDelete }: Props) {
  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 flex flex-col gap-4">
      <h1 className="neon-tubes-styling text-4xl mb-4 text-center">Ongoing games</h1>

      {games.length === 0 && <p>No games in progress.</p>}

      {games.map((g) => (
        <div key={g.id} className="flex justify-between items-center border p-3 rounded-xl">
          <div>
            <p className="font-semibold">Game #{g.id}</p>
            <p className="text-xs opacity-70">Last played: {new Date(g.updated_at).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onContinue(g.id)}>
              Continue
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(g.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}