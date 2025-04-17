import { getLeaderboardData } from "./leaderboardData";
import LeaderboardView from "@/views/LeaderboardView";

export default async function LeaderboardPresenter() {
  const { userLocation, nearYouList, allTimeList } = await getLeaderboardData();

  return (
    <LeaderboardView
      userLocation={userLocation}
      nearYouList={nearYouList}
      allTimeList={allTimeList}
    />
  );
}
