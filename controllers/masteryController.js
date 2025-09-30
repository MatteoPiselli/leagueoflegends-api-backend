const Summoner = require("../models/summoner");
const Mastery = require("../models/mastery");
const { getMasteriesByPuuid } = require("../api/masteriesApi");

/**
 * Get masteries data for a player using PUUID
 * Save the masteries data in MongoDB
 */
exports.getMasteries = async (req, res) => {
  const { puuid } = req.params;

  try {
    // 1. Get masteries data from Riot API
    const masteriesData = await getMasteriesByPuuid(puuid);

    // 2. Find Summoner by PUUID
    const dbSummoner = await Summoner.findOne({ puuid });
    if (!dbSummoner) {
      return res.status(404).json({ error: "Summoner not found" });
    }

    // 3. Save/Update each mastery in MongoDB
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

    // Send masteries data to client
    res.json({ masteries });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Masteries Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
