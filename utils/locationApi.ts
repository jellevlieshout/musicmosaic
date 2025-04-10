// await getUserLocation(); to get the location (ip)

const LOCATION_API_URL = "https://api.ipgeolocation.io/ipgeo";
const LOCATION_API_KEY = process.env.NEXT_PUBLIC_LOCATION_API_KEY;

const passingFetchValue = 200;

export async function getUserLocation(){
    const fields = "ip,city,country_name,country_code2,state_prov,latitude,longitude,time_zone";
    const query = `apiKey=${LOCATION_API_KEY}&fields=${fields}`;

    const URLToSend = `${LOCATION_API_URL}?${query}`;

    const response = await fetch(URLToSend, { method: 'GET' });
    if(response.status !== passingFetchValue){
        throw new Error("Could not fetch location data");
    }
    const location_data = await response.json();
    console.log("LOCATION_DATA:", location_data);

    return {
        ip: location_data.ip,
        city: location_data.city,
        region: location_data.state_prov,
        country: location_data.country_name,
        countryCode: location_data.country_code2,
        lat: location_data.latitude,
        lon: location_data.longitude,
        timezone: location_data.time_zone?.name,
    };
}