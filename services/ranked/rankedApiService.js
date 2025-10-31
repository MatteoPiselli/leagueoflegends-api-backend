const { getRankedByPuuid } = require("../../api/rankedApi");

/**
 * Fetch ranked data for a player from Riot API
 * @param {string} puuid
 * @returns {Object}
 */
async function fetchRankedByPuuid(puuid) {
  return await getRankedByPuuid(puuid);
}

module.exports = {
  fetchRankedByPuuid,
};
