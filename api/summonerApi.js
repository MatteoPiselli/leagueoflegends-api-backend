// Utility functions to interact with Riot Games API

const RIOT_API_KEY = process.env.RIOT_API_KEY;

// ----- Get PUUID from Riot ID ----- //
async function getRiotId(username, tagline) {
  const response = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}?api_key=${RIOT_API_KEY}`
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Riot ID error: ${response.status} - ${errorText}`);
  }
  return response.json();
}

// ----- Get player info using PUUID ----- //
async function getSummonerByPuuid(puuid) {
  const response = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Summoner info error: ${response.status} - ${errorText}`);
  }
  return response.json();
}

module.exports = {
  getRiotId,
  getSummonerByPuuid,
};
