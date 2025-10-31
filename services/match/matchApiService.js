const {
  getMatchDetails: getRiotMatchDetails,
  getMatchHistory: getRiotMatchHistory,
} = require("../../api/matchApi");

/**
 * Fetch match details from Riot API
 * @param {string} matchId
 * @returns {Object}
 */
async function fetchMatchDetails(matchId) {
  return await getRiotMatchDetails(matchId);
}

/**
 * Fetch match history from Riot API
 * @param {string} puuid
 * @param {number} start
 * @param {number} count
 * @returns {Array}
 */
async function fetchMatchHistory(puuid, start = 0, count = 5) {
  return await getRiotMatchHistory(puuid, start, count);
}

module.exports = {
  fetchMatchDetails,
  fetchMatchHistory,
};
