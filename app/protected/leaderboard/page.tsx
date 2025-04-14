import LeaderboardView from "@/views/LeaderboardView";
import { getUserLocation } from '@/utils/locationApi';

export default async function LeaderboardPresenter() {
  const loc = await getUserLocation();

  return (
    <LeaderboardView location={`${loc.city}, ${loc.country}`} />
  );
}