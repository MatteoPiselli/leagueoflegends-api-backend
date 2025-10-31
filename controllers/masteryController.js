const masteryService = require("../services/mastery/masteryService");

/**
 * Get masteries data for a player
 */
exports.getMasteries = async (req, res) => {
  const { puuid } = req.params;
  const { updateClicked } = req.query;

  try {
    const result = await masteryService.getMasteries(
      puuid,
      updateClicked === "true"
    );
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Masteries Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
