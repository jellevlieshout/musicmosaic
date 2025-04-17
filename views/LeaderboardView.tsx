"use client";

interface LeaderboardViewProps {
  userLocation: string;
  nearYouList: Array<{
    name: string;
    location: string | null;
    wins: number | null;
    highest_score: number | null;
  }>;
  allTimeList: Array<{
    name: string;
    location: string | null;
    wins: number | null;
    highest_score: number | null;
  }>;
}

export default function LeaderboardView({
  userLocation,
  nearYouList,
  allTimeList,
}: LeaderboardViewProps) {

  const renderRow = (item: any, index: number) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.location ?? "Unknown"}</td>
      <td>{item.wins ?? 0}</td>
      <td>{item.highest_score ?? 0}</td>
    </tr>
  );

  return (
    <div className="parentContainerLeaderboard">
      <h1 className="neon-tubes-styling text-5xl text-center">Leaderboard</h1>
      <h2 className="neon-tubes-styling text-3xl mt-5 text-center">
        Near you ({userLocation})
      </h2>
      <table className="table-auto w-full border-separate border-spacing-4 text-left mt-2">
        <thead>
          <tr>
            <th>Username</th>
            <th>Location</th>
            <th>Wins</th>
            <th>Highest score</th>
          </tr>
        </thead>
        <tbody>
          {nearYouList.map(renderRow)}
        </tbody>
      </table>
      <h2 className="neon-tubes-styling text-3xl mt-5 text-center">All time</h2>
      <table className="table-auto w-full border-separate border-spacing-4 text-left mt-2">
        <thead>
          <tr>
            <th>Username</th>
            <th>Location</th>
            <th>Wins</th>
            <th>Highest score</th>
          </tr>
        </thead>
        <tbody>
          {allTimeList.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}