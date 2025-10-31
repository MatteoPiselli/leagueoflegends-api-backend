const Champion = require("../../database/models/champion");

/**
 * Find champion stats for a summoner and queue type
 */
async function findChampionStats(summonerId, queueType) {
  return await Champion.findOne({ summoner: summonerId, queueType });
}

/**
 * Save or update champion stats for a summoner and queue type
 */
async function saveChampionStats(summonerId, queueType, stats) {
  return await Champion.findOneAndUpdate(
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
