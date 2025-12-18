const {
  getMatchDetails: getRiotMatchDetails,
  getMatchHistory: getRiotMatchHistory,
} = require("../../api/matchApi");

/**
 * Fetch match details from Riot API
 * @param {string} matchId
 * @returns {Object}
 */
function fetchMatchDetails(matchId) {
  return getRiotMatchDetails(matchId);
}

/**
 * Fetch match history from Riot API
 * @param {string} puuid
 * @param {number} start
 * @param {number} count
 * @returns {Array}
 */
function fetchMatchHistory(puuid, start = 0, count = 5) {
  return getRiotMatchHistory(puuid, start, count);
}

module.exports = {
  fetchMatchDetails,
  fetchMatchHistory,
};
