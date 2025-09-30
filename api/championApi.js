const RIOT_API_KEY = process.env.RIOT_API_KEY;

async function getMatchIds(puuid, start = 0, count = 100) {
  const response = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${RIOT_API_KEY}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Match IDs error: ${response.status} - ${errorText}`
    );
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

async function getMatchData(matchId) {
  const response = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Match Data error: ${response.status} - ${errorText}`
    );
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  getMatchIds,
  getMatchData,
  delay,
};
