const championService = require("../services/champion/championService");

/**
 * Get champion statistics for a player
 */
exports.getChampionStats = async (req, res) => {
  const { puuid } = req.params;
  const { queueType, updateClicked } = req.query;

  try {
    const result = await championService.getChampionStats(
      puuid,
      queueType || "400",
      updateClicked === "true"
    );
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(
      "Champion Stats Error:",
      error.message,
      "Status:",
      statusCode
    );
    res.status(statusCode).json({ error: error.message });
  }
};
