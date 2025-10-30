const { getRankedByPuuid } = require("../api/rankedApi");
const Summoner = require("../database/models/summoner");
const Ranked = require("../database/models/ranked");
const formatRankedData = require("./utils/formatRankedData").default;

/**
 * Get ranked data for a player using PUUID
 * @param {string} puuid - Player's PUUID
 * @param {boolean} forceUpdate - Whether to force update from Riot API
 * @returns {Object} Ranked data with SoloDuo and Flex information
 */
const getRanked = async (puuid, forceUpdate = false) => {
  // 1. Find Summoner by PUUID
  const dbSummoner = await Summoner.findOne({ puuid });
  if (!dbSummoner) {
    const error = new Error("Summoner not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check if we have ranked data in database (skip if forceUpdate is true)
  if (!forceUpdate) {
    const existingRanked = await Ranked.findOne({ summoner: dbSummoner._id });
    if (existingRanked) {
      return { ranked: existingRanked };
    }
  }

  // 3. Get ranked data from Riot API
  const rankedData = await getRankedByPuuid(puuid);

  // 4. Extract and format ranked data
  const formattedRankedData = formatRankedData(rankedData);

  // 5. Save/Update the ranked data in MongoDB
  const updatedRanked = await Ranked.findOneAndUpdate(
    { summoner: dbSummoner._id },
    {
      $set: {
        ...formattedRankedData,
        updatedAt: new Date(),
      },
    },
    // Create if not exists, return the new document
    { upsert: true, new: true }
  );

  return { ranked: updatedRanked };
};

module.exports = {
  getRanked,
};
