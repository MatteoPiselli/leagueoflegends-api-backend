const { getMasteriesByPuuid } = require("../../api/masteriesApi");

/**
 * Fetch masteries by PUUID from Riot API
 * @param {string} puuid
 * @returns {Array}
 */
function fetchMasteriesByPuuid(puuid) {
  return getMasteriesByPuuid(puuid);
}

module.exports = {
  fetchMasteriesByPuuid,
};
