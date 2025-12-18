const Champion = require("../../database/models/champion");

/**
 * Find champion stats for a summoner and queue type
 */
function findChampionStats(summonerId, queueType) {
  return Champion.findOne({ summoner: summonerId, queueType });
}

/**
 * Save or update champion stats for a summoner and queue type
 */
function saveChampionStats(summonerId, queueType, stats) {
  return Champion.findOneAndUpdate(
    { summoner: summonerId, queueType },
    {
      $set: {
        championStats: stats,
        updatedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}

module.exports = {
  findChampionStats,
  saveChampionStats,
};
