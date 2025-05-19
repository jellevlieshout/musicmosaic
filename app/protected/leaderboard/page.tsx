"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserLocation } from "@/utils/locationApi";
import LeaderboardView from "@/views/LeaderboardView";

export default function LeaderboardPresenter() {
  const [nearYouList, setNearYouList] = useState<any[]>([]);
  const [allTimeList, setAllTimeList] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("Unknown");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function fetchLocation() {
        fetch(`https://api.ipgeolocation.io/v2/ipgeo?apiKey=${process.env.NEXT_PUBLIC_LOCATION_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          setLocation(data.location?.city + ", " + data.location?.country_name);
        })
        .catch(error => {
          console.error("Failed to fetch location:", error);
        });
      } 
  
    fetchLocation();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        const { data: nearYouData, error: nearYouError } = await supabase
          .from("player")
          .select("name, location, wins, highest_score")
          .ilike("location", `%${location}%`)
          .order("wins", { ascending: false })
          .order("highest_score", { ascending: false })
          .limit(5);

        if (nearYouError) {
          console.error("error fetching nearYouData:", nearYouError);
        }

        const { data: allTimeData, error: allTimeError } = await supabase
          .from("player")
          .select("name, location, wins, highest_score")
          .ilike("location", `%%`)
          .order("wins", { ascending: false })
          .order("highest_score", { ascending: false })
          .limit(5);

        if (allTimeError) {
          console.error("error fetching allTimeData:", allTimeError);
        }

        setNearYouList(nearYouData ?? []);
        setAllTimeList(allTimeData ?? []);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [location]);

  if (isLoading) {
    return <div className="p-6">Loading leaderboard...</div>;
  }

  return (
    <LeaderboardView
      userLocation={location}
      nearYouList={nearYouList}
      allTimeList={allTimeList}
    />
  );
}
