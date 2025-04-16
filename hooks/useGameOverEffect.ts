import { useEffect } from "react";
import { useGameplayStore } from "@/stores/hitsterModelStore";
import { createClient } from "@/utils/supabase/client";

export function useGameOverEffect(gameId: string) {
  const supabase = createClient();
  const { currentPlayers, gameSettings } = useGameplayStore();

  useEffect(() => {

    if (!currentPlayers || !gameSettings?.gameLength) 
        return;

    const gameIsOver = currentPlayers.some(
      (player) => player.deck.length - 1 >= +gameSettings.gameLength
    );

    if (!gameIsOver) 
        return;

    const scoresMap = currentPlayers.map((p) => ({
      name: p.name,
      score: p.deck.length - 1,
    }));
    const highestScoreValue = Math.max(...scoresMap.map((p) => p.score));

    const winners = scoresMap.filter((p) => p.score === highestScoreValue);

    // save data in database
    const syncScores = async () => {
      // get logged in user from supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Could not fetch user:", userError);
        return;
      }

      // update each player with potential new highscore
      for (const player of currentPlayers) {
        const thisPlayersScore = player.deck.length - 1;

        // get current wins/highest_score from DB
        const { data: existing, error } = await supabase
          .from("player")
          .select("id, wins, highest_score")
          .eq("name", player.name)
          .maybeSingle();

        if (error) {
          console.error(`Error fetching data for ${player.name}:`, error);
          continue;
        }

        const updatedHighestScore = Math.max(
          thisPlayersScore,
          existing?.highest_score ?? 0
        );

        const isWinner = winners.some((w) => w.name === player.name);
        const updatedWins = (existing?.wins ?? 0) + (isWinner ? 1 : 0);

        // upsert data
        const { error: upsertError } = await supabase
          .from("player")
          .upsert({
            id: existing?.id,
            name: player.name,
            wins: updatedWins,
            highest_score: updatedHighestScore,
            location: player.location ?? "Unknown",
            user_id: user.id,
            game_id: gameId
          })
          .eq("id", existing?.id); // maybe not needed

        if (upsertError) {
          console.error(`Could not update ${player.name}:`, upsertError);
        } else {
          console.log(`Score & wins saved for ${player.name}`);
        }
      }
    };
    syncScores();
  }, [currentPlayers, gameSettings, gameId]);
}