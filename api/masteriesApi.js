// Utility functions to interact with Riot Games API for Champion Masteries

const RIOT_API_KEY = process.env.RIOT_API_KEY;

async function getMasteriesByPuuid(puuid) {
  // --------------- Recovery of the player's masteries ------------------ //
  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/?api_key=${RIOT_API_KEY}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Masteries error: ${response.status} - ${errorText}`
    );
    error.statusCode = response.status;
    throw error;
  }

  // ------------- Recovery of the masteries data limiting to 3 champions ------------- //
  const masteriesJson = await response.json();

  const masteriesData = masteriesJson
    ? masteriesJson.slice(0, 3).map((mastery) => ({
        championId: mastery.championId,
        championLevel: mastery.championLevel,
        championPoints: mastery.championPoints,
      }))
    : [];

  return masteriesData;
}

module.exports = {
  getMasteriesByPuuid,
};
