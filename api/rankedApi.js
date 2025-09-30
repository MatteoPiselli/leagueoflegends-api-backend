// Utility function to get ranked data from Riot API

const RIOT_API_KEY = process.env.RIOT_API_KEY;

// ----- Get ranked data using PUUID ----- //
async function getRankedByPuuid(puuid) {
  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}/?api_key=${RIOT_API_KEY}`
  );
  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Ranked response error: ${response.status} - ${errorText}`
    );
    error.statusCode = response.status;
    throw error;
  }
  return response.json();
}

module.exports = {
  getRankedByPuuid,
};
