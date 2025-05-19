"use client";

import { useHitsterPersistence } from "@/hooks/useHitsterPersistence";
import GameTutorialView from "@/views/GameTutorialView";
import { useSearchParams } from "next/navigation";

export default function GameTutorialPresenter() {

  const searchParams = useSearchParams();
  const gameIdParam = searchParams.get('gameId');
  const { gameId } = useHitsterPersistence(gameIdParam);
  
  return (
    <GameTutorialView gameId={gameId}/>
  );
}
