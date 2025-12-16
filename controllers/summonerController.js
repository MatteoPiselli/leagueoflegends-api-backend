const summonerService = require("../services/summoner/summonerService");

/**
 * Search for a player using Riot API and return info
 */
exports.searchSummoner = async (req, res) => {
  const { username, tagline } = req.params;
  const { updateClicked } = req.query;

  try {
    const result = await summonerService.searchSummoner(
      username,
      tagline,
      updateClicked === "true"
    );
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Summoner Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
