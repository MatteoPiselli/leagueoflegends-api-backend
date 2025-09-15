const Summoner = require("../models/summoner");
const { getRiotId, getSummonerByPuuid } = require("../api/summonerApi");

/**
 * Search for a player using Riot API and return info.
 * Save the player in MongoDB if not already present.
 */
exports.searchSummoner = async (req, res) => {
  const { username, tagline } = req.params;

  try {
    // 1. Get PUUID from Riot ID using utility function
    const riotIdData = await getRiotId(username, tagline);
    const puuid = riotIdData.puuid;

    // 2. Get player info from PUUID using utility function
    const summonerData = await getSummonerByPuuid(puuid);

    // 3. Save player in MongoDB if not already present
    let dbSummoner = await Summoner.findOne({ puuid });
    if (!dbSummoner) {
      dbSummoner = new Summoner({
        username,
        tagline,
        puuid,
        level: summonerData.summonerLevel,
        profileIconId: summonerData.profileIconId,
      });
      await dbSummoner.save();
    }

    // 4. Send info to client
    res.json({ riotId: riotIdData, summoner: summonerData, dbSummoner });
  } catch (error) {
    // Centralized error handling
    console.error("Error backend :", error.message);
    res.status(500).json({ error: error.message });
  }
};
