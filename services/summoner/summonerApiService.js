const { getRiotId, getSummonerByPuuid } = require("../../api/summonerApi");

/**
 * Fetch Riot ID data for a username and tagline
 * @param {string} username
 * @param {string} tagline
 * @returns {Object}
 */
async function fetchRiotId(username, tagline) {
  return await getRiotId(username, tagline);
}

/**
 * Fetch summoner data by PUUID
 * @param {string} puuid
 * @returns {Object}
 */
async function fetchSummonerByPuuid(puuid) {
  return await getSummonerByPuuid(puuid);
}

module.exports = {
  fetchRiotId,
  fetchSummonerByPuuid,
};
