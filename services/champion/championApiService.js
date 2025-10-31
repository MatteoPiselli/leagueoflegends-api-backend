const { getMatchIds } = require("../../api/championApi");

/**
 * Fetch match IDs for a summoner from Riot API
 */
async function fetchMatchIds(puuid, start = 0, count = 100) {
  return await getMatchIds(puuid, start, count);
}

module.exports = {
  fetchMatchIds,
};
