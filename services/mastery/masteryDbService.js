const Mastery = require("../../database/models/mastery");

/**
 * Retrieves masteries for a summoner by their ID
 * @param {string} summonerId
 * @returns {Array}
 */
function findMasteries(summonerId) {
  return Mastery.find({ summoner: summonerId });
}

/**
 * Save or update a mastery for a summoner
 * @param {string} summonerId
 * @param {Object} masteryData
 * @returns {Object}
 */
function saveOrUpdateMastery(summonerId, masteryData) {
  return Mastery.findOneAndUpdate(
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

/**
 * Delete all masteries for a summoner
 * @param {string} summonerId
 * @returns {Object}
 */
function deleteMasteries(summonerId) {
  return Mastery.deleteMany({ summoner: summonerId });
}

module.exports = {
  findMasteries,
  saveOrUpdateMastery,
  deleteMasteries,
};
