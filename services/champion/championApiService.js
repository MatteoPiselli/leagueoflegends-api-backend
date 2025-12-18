const { getMatchIds } = require("../../api/championApi");

/**
 * Fetch match IDs for a summoner from Riot API
 */
function fetchMatchIds(puuid, start = 0, count = 100) {
  return getMatchIds(puuid, start, count);
}

module.exports = {
  fetchMatchIds,
};
