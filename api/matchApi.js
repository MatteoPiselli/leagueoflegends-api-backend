// Utility functions to interact with Riot Games API for matches

const RIOT_API_KEY = process.env.RIOT_API_KEY;

// ----- Get Match History by PUUID ----- //
async function getMatchHistory(puuid, start = 0, count = 5) {
  const response = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${RIOT_API_KEY}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Match History error: ${response.status} - ${errorText}`
    );
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

// ----- Get Match Details by Match ID ----- //
async function getMatchDetails(matchId) {
  const response = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Match Details error: ${response.status} - ${errorText}`
    );
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

module.exports = {
  getMatchHistory,
  getMatchDetails,
};
