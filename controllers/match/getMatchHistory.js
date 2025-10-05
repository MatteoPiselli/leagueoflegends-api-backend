const Match = require("../../models/match");
const { getMatchHistory } = require("../../api/matchApi");

module.exports = async (req, res) => {
  const { puuid } = req.params;
  const { updateClicked } = req.query;

  try {
    // Check if we have matches in database first (skip if updateClicked is true)
    if (!updateClicked) {
      const dbMatches = await Match.find({ "participants.puuid": puuid })
        .sort({ gameCreation: -1 })
        .limit(5)
        .select("matchId");

      if (dbMatches.length > 0) {
        // Return matches from database
        const matchIds = dbMatches.map((match) => match.matchId);
        return res.json({ matchs: matchIds });
      }
    }

    // Get match history from Riot API
    const matchsHistoryData = await getMatchHistory(puuid, 0, 5);

    res.json({ matchs: matchsHistoryData });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Match History Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
