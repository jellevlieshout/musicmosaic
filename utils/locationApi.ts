const LOCATION_API_URL = "http://ip-api.com/json/?fields=status,message,query,city,regionName,country,countryCode,lat,lon,timezone";

const passingFetchValue = 200;

export async function getUserLocation() {
    const response = await fetch(LOCATION_API_URL, { method: 'GET' });

    if (response.status !== passingFetchValue) {
        throw new Error("Could not fetch location data");
    }

    const location_data = await response.json();

    if (location_data.status !== "success") {
        throw new Error("API returned error: " + location_data.message);
    }

    console.log("LOCATION_DATA:", location_data);

    return {
        ip: location_data.query,
        city: location_data.city,
        region: location_data.regionName,
        country: location_data.country,
        countryCode: location_data.countryCode,
        lat: location_data.lat,
        lon: location_data.lon,
        timezone: location_data.timezone,
    };
}