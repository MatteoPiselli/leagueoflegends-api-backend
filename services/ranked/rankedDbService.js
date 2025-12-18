const Ranked = require("../../database/models/ranked");

/**
 * Find ranked data for a summoner
 * @param {string} summonerId
 * @returns {Object}
 */
function findRanked(summonerId) {
  return Ranked.findOne({ summoner: summonerId });
}

/**
 * Save or update ranked data for a summoner
 * @param {string} summonerId
 * @param {Object} rankedData
 * @returns {Object}
 */
function saveOrUpdateRanked(summonerId, rankedData) {
  return Ranked.findOneAndUpdate(
    { summoner: summonerId },
    {
      $set: {
        ...rankedData,
        updatedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}

module.exports = {
  findRanked,
  saveOrUpdateRanked,
};
