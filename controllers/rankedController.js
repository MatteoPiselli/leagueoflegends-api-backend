const { getRankedByPuuid } = require("../api/rankedApi");
const Summoner = require("../models/summoner");
const Ranked = require("../models/ranked");

/**
 * Get ranked data for a player using PUUID
 * Save the ranked data in MongoDB
 */
exports.getRanked = async (req, res) => {
  const { puuid } = req.params;
  const { updateClicked } = req.query;

  try {
    // 1. Find Summoner by PUUID
    const dbSummoner = await Summoner.findOne({ puuid });
    if (!dbSummoner) {
      return res.status(404).json({ error: "Summoner not found" });
    }

    // 2. Check if we have ranked data in database (skip if updateClicked is true)
    const existingRanked = await Ranked.findOne({ summoner: dbSummoner._id });
    if (existingRanked && !updateClicked) {
      return res.json({ ranked: existingRanked });
    }

    // 3. Get ranked data from Riot API
    const rankedData = await getRankedByPuuid(puuid);

    // 4. Extract SoloDuo and Flex data from API response
    const soloDuo =
      rankedData.find((q) => q.queueType === "RANKED_SOLO_5x5") || {};
    const flex = rankedData.find((q) => q.queueType === "RANKED_FLEX_SR") || {};

    // 5. Save/Update the ranked data in MongoDB
    const updatedRanked = await Ranked.findOneAndUpdate(
      { summoner: dbSummoner._id },
      {
        $set: {
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
          updatedAt: new Date(),
        },
      },
      // Create if not exists, return the new document
      { upsert: true, new: true }
    );

    // Send ranked data to client
    res.json({ ranked: updatedRanked });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Error Ranked:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
