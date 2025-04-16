import { createClient } from "@/utils/supabase/client";
import { getUserLocation } from "@/utils/locationApi";

export async function getLeaderboardData() {
  const supabase = createClient();

  const loc = await getUserLocation();
  const userLocation =
    loc?.city && loc?.country ? `${loc.city}, ${loc.country}` : "Unknown";

  const { data: nearYouData, error: nearYouError } = await supabase
    .from("player")
    .select("name, location, wins, highest_score")
    .ilike("location", `%${loc.city}%`)
    .order("wins", { ascending: false })
    .order("highest_score", { ascending: false })
    .limit(5);

  if (nearYouError) {
    console.error("error fetching nearYouData:", nearYouError);
  }

  const { data: allTimeData, error: allTimeError } = await supabase
    .from("player")
    .select("name, location, wins, highest_score")
    // .ilike("location", `%%`)
    .order("highest_score", { ascending: true })
    .order("wins", { ascending: true })
    .limit(5)
    // should be .order("wins", { ascending: false })
    // .order("highest_score", { ascending: false })
    // but that didnt work 

  if (allTimeError) {
    console.error("error fetching allTimeData:", allTimeError);
  }

  return {
    userLocation,
    nearYouList: nearYouData ?? [],
    allTimeList: allTimeData ?? [],
  };
}
