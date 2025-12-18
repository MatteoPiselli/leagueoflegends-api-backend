const { getRankedByPuuid } = require("../../api/rankedApi");

/**
 * Fetch ranked data for a player from Riot API
 * @param {string} puuid
 * @returns {Object}
 */
function fetchRankedByPuuid(puuid) {
  return getRankedByPuuid(puuid);
}

module.exports = {
  fetchRankedByPuuid,
};
