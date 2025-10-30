const summonerService = require("../services/summonerService");

/**
 * Search for a player using Riot API and return info
 */
exports.searchSummoner = async (req, res) => {
  const { username, tagline } = req.params;

  try {
    const result = await summonerService.searchSummoner(username, tagline);
    res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Summoner Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
