const Mastery = require("../../database/models/mastery");

/**
 * Retrieves masteries for a summoner by their ID
 * @param {string} summonerId
 * @returns {Array}
 */
async function findMasteries(summonerId) {
  return await Mastery.find({ summoner: summonerId });
}

/**
 * Save or update a mastery for a summoner
 * @param {string} summonerId
 * @param {Object} masteryData
 * @returns {Object}
 */
async function saveOrUpdateMastery(summonerId, masteryData) {
  return await Mastery.findOneAndUpdate(
    {
      summoner: summonerId,
      championId: masteryData.championId,
    },
    {
      $set: {
        championLevel: masteryData.championLevel,
        championPoints: masteryData.championPoints,
        updatedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}

module.exports = {
  findMasteries,
  saveOrUpdateMastery,
};
