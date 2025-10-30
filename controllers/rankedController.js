const rankedService = require("../services/rankedService");

/**
 * Get ranked data for a player
 */
exports.getRanked = async (req, res) => {
  const { puuid } = req.params;
  const { updateClicked } = req.query;

  try {
    const result = await rankedService.getRanked(
      puuid,
      updateClicked === "true"
    );
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Ranked Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
