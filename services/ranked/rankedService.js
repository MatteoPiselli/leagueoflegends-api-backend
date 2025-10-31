const Summoner = require("../../database/models/summoner");
const rankedDbService = require("./rankedDbService");
const rankedApiService = require("./rankedApiService");
const formatRankedData = require("./utils/formatRankedData");

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
    const existingRanked = await rankedDbService.findRanked(dbSummoner._id);
    if (existingRanked) {
      return { ranked: existingRanked };
    }
  }

  // 3. Get ranked data from Riot API
  const rankedData = await rankedApiService.fetchRankedByPuuid(puuid);

  // 4. Extract and format ranked data
  const formattedRankedData = formatRankedData(rankedData);

  // 5. Save/Update the ranked data in database
  const updatedRanked = await rankedDbService.saveOrUpdateRanked(
    dbSummoner._id,
    formattedRankedData
  );

  return { ranked: updatedRanked };
};

module.exports = {
  getRanked,
};
