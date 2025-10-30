const Summoner = require("../database/models/summoner");
const Mastery = require("../database/models/mastery");
const { getMasteriesByPuuid } = require("../api/masteriesApi");

/**
 * Get masteries data for a player using PUUID
 * @param {string} puuid - Player's PUUID
 * @param {boolean} forceUpdate - Whether to force update from Riot API
 * @returns {Object} Masteries data
 */
const getMasteries = async (puuid, forceUpdate = false) => {
  // 1. Find Summoner by PUUID
  const dbSummoner = await Summoner.findOne({ puuid });
  if (!dbSummoner) {
    const error = new Error("Summoner not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check if we have masteries data in database (skip if forceUpdate is true)
  if (!forceUpdate) {
    const existingMasteries = await Mastery.find({
      summoner: dbSummoner._id,
    });
    if (existingMasteries.length > 0) {
      return { masteries: existingMasteries };
    }
  }

  // 3. Get masteries data from Riot API
  const masteriesData = await getMasteriesByPuuid(puuid);

  // 4. Save/Update each mastery in MongoDB
  const masteries = [];
  for (const masteryData of masteriesData) {
    const savedMastery = await Mastery.findOneAndUpdate(
      {
        summoner: dbSummoner._id,
        championId: masteryData.championId,
      },
      {
        $set: {
          championLevel: masteryData.championLevel,
          championPoints: masteryData.championPoints,
          updatedAt: new Date(),
        },
      },
      // Create if not exists, return the new document
      { upsert: true, new: true }
    );
    masteries.push(savedMastery);
  }

  return { masteries };
};

module.exports = {
  getMasteries,
};
