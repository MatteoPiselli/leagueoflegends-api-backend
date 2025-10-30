/**
 * Format raw ranked data from Riot API into our database structure
 * @param {Array} rankedData - Raw ranked data from Riot API
 * @returns {Object} Formatted ranked data
 */
function formatRankedData(rankedData) {
  // Extract SoloDuo and Flex data from API response
  const soloDuo =
    rankedData.find((q) => q.queueType === "RANKED_SOLO_5x5") || {};
  const flex = rankedData.find((q) => q.queueType === "RANKED_FLEX_SR") || {};

  return {
    soloDuo: {
      tier: soloDuo.tier || "Unranked",
      rank: soloDuo.rank || "",
      lp: soloDuo.leaguePoints || 0,
      wins: soloDuo.wins || 0,
      losses: soloDuo.losses || 0,
      updatedAt: new Date(),
    },
    flex: {
      tier: flex.tier || "Unranked",
      rank: flex.rank || "",
      lp: flex.leaguePoints || 0,
      wins: flex.wins || 0,
      losses: flex.losses || 0,
      updatedAt: new Date(),
    },
  };
}

module.exports = formatRankedData;
