const matchService = require("../services/match/matchService");

/**
 * Get detailed information about a specific match
 */
exports.getMatchDetails = async (req, res) => {
  const { matchId } = req.params;

  try {
    const result = await matchService.getMatchDetails(matchId);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Match Details Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};

/**
 * Get match history for a player
 */
exports.getMatchHistory = async (req, res) => {
  const { puuid } = req.params;
  const { updateClicked } = req.query;

  try {
    const result = await matchService.getMatchHistory(
      puuid,
      updateClicked === "true"
    );
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Match History Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
