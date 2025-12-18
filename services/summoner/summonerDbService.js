const Summoner = require("../../database/models/summoner");

/**
 * Find a summoner by username and tagline
 * @param {string} username
 * @param {string} tagline
 * @returns {Object}
 */
function findSummonerByNameAndTag(username, tagline) {
  return Summoner.findOne({ username, tagline });
}

/**
 * Find a summoner by PUUID
 * @param {string} puuid
 * @returns {Object}
 */
function findSummonerByPuuid(puuid) {
  return Summoner.findOne({ puuid });
}

/**
 * Create or update a summoner
 * @param {string} puuid
 * @param {Object} data
 * @returns {Object}
 */
function saveOrUpdateSummoner(puuid, data) {
  return Summoner.findOneAndUpdate(
    { puuid },
    {
      $set: {
        username: data.username,
        tagline: data.tagline,
        level: data.level,
        profileIconId: data.profileIconId,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        puuid,
      },
    },
    { new: true, upsert: true }
  );
}

module.exports = {
  findSummonerByNameAndTag,
  findSummonerByPuuid,
  saveOrUpdateSummoner,
};
