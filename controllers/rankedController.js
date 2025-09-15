const { getRankedByPuuid } = require("../api/rankedApi");
const Summoner = require("../models/summoner");
const Ranked = require("../models/ranked");

/**
 * Get ranked data for a player using PUUID
 * Save the ranked data in MongoDB
 */
exports.getRanked = async (req, res) => {
  const { puuid } = req.params;

  try {
    // 1. Get ranked data from Riot API
    const rankedData = await getRankedByPuuid(puuid);

    // 2. Find Summoner by PUUID
    const dbSummoner = await Summoner.findOne({ puuid });
    if (!dbSummoner) {
      return res.status(404).json({ error: "Summoner not found" });
    }

    // 3. Extract SoloDuo and Flex data from API response
    const soloDuo =
      rankedData.find((q) => q.queueType === "RANKED_SOLO_5x5") || {};
    const flex = rankedData.find((q) => q.queueType === "RANKED_FLEX_SR") || {};

    // 4. Save the ranked data in MongoDB
    await Ranked.findOneAndUpdate(
      { summoner: dbSummoner._id },
      {
        $set: {
          soloDuo: {
            tier: soloDuo.tier || "Unranked",
            rank: soloDuo.rank || "",
            lp: soloDuo.leaguePoints || 0,
            wins: soloDuo.wins || 0,
            losses: soloDuo.losses || 0,
          },
          flex: {
            tier: flex.tier || "Unranked",
            rank: flex.rank || "",
            lp: flex.leaguePoints || 0,
            wins: flex.wins || 0,
            losses: flex.losses || 0,
          },
        },
      },
      // Create if not exists, return the new document
      { upsert: true, new: true }
    );

    // 5. Get ranked data from database
    const ranked = await Ranked.findOne({ summoner: dbSummoner._id });

    // Send ranked data to client
    res.json({ ranked });
  } catch (error) {
    // Centralized error handling
    console.error("Error backend :", error.message);
    res.status(500).json({ error: error.message });
  }
};
