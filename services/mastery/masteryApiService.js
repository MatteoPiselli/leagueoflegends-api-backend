const { getMasteriesByPuuid } = require("../../api/masteriesApi");

/**
 * Fetch masteries by PUUID from Riot API
 * @param {string} puuid
 * @returns {Array}
 */
async function fetchMasteriesByPuuid(puuid) {
  return await getMasteriesByPuuid(puuid);
}

module.exports = {
  fetchMasteriesByPuuid,
};
