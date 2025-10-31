const Ranked = require("../../database/models/ranked");

/**
 * Find ranked data for a summoner
 * @param {string} summonerId
 * @returns {Object}
 */
async function findRanked(summonerId) {
  return await Ranked.findOne({ summoner: summonerId });
}

/**
 * Save or update ranked data for a summoner
 * @param {string} summonerId
 * @param {Object} rankedData
 * @returns {Object}
 */
async function saveOrUpdateRanked(summonerId, rankedData) {
  return await Ranked.findOneAndUpdate(
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
