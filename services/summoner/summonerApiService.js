const { getRiotId, getSummonerByPuuid } = require("../../api/summonerApi");

/**
 * Fetch Riot ID data for a username and tagline
 * @param {string} username
 * @param {string} tagline
 * @returns {Object}
 */
function fetchRiotId(username, tagline) {
  return getRiotId(username, tagline);
}

/**
 * Fetch summoner data by PUUID
 * @param {string} puuid
 * @returns {Object}
 */
function fetchSummonerByPuuid(puuid) {
  return getSummonerByPuuid(puuid);
}

module.exports = {
  fetchRiotId,
  fetchSummonerByPuuid,
};
