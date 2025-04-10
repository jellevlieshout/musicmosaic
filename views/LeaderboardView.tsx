import '@/app/globals.css';
import { getUserLocation } from '@/utils/locationApi';

function renderNearYouRow(item: any, index: any) {
  return (
    <tr key={index}>
      <td>{item.username}</td>
      <td>{item.location}</td>
      <td>{item.wins}</td>
      <td>{item.stat1}</td>
      <td>{item.stat2}</td>
    </tr>
  );
}

function renderAllTimeRow(item: any, index: any) {
  return (
    <tr key={index}>
      <td>{item.username}</td>
      <td>{item.location}</td>
      <td>{item.wins}</td>
      <td>{item.stat1}</td>
      <td>{item.stat2}</td>
    </tr>
  );
}

export default async function Leaderboard() {
  const loc = await getUserLocation();
  // console.log("LOCATION_DATA:", loc);
  const locationString = `${loc.city}, ${loc.country}`;
  const nearYouData = [
    { username: "User123 (you)", location: locationString, wins: 7, stat1: "XX", stat2: "YY" },
    { username: "MusicMan5",     location: locationString, wins: 6, stat1: "AA", stat2: "BB" },
  ];
  const allTimeData = [
    { username: "ILoveBeyonce",  location: locationString,    wins: 21, stat1: "XX", stat2: "YY" },
    { username: "GoldenOldies",  location: locationString, wins: 19, stat1: "AA", stat2: "BB" },
  ];

  return (
    <div className="parentContainerLeaderboard">
      <h1 className="neon-tubes-styling text-5xl text-center">Leaderboard</h1>
      <h2 className="neon-tubes-styling text-3xl mt-5 text-center">Near you</h2>
      <table className="table-auto w-full border-separate border-spacing-4 text-left mt-2">
        <thead>
          <tr>
            <th>Username</th>
            <th>Location</th>
            <th>Wins</th>
            <th>Stat #1</th>
            <th>Stat #2</th>
          </tr>
        </thead>
        <tbody>
          {nearYouData.map(renderNearYouRow)}
        </tbody>
      </table>

      <h2 className="neon-tubes-styling text-3xl mt-5 text-center">All time</h2>
      <table className="table-auto w-full border-separate border-spacing-4 text-left mt-2">
        <thead>
          <tr>
            <th>Username</th>
            <th>Location</th>
            <th>Wins</th>
            <th>Stat #1</th>
            <th>Stat #2</th>
          </tr>
        </thead>
        <tbody>
          {allTimeData.map(renderAllTimeRow)}
        </tbody>
      </table>
    </div>
  );
}