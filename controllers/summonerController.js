const Summoner = require("../models/summoner");
const { getRiotId, getSummonerByPuuid } = require("../api/summonerApi");

/**
 * Search for a player using Riot API and return info.
 * Save the player in MongoDB if not already present.
 * Update profileIconId and level if the player is already present.
 */
exports.searchSummoner = async (req, res) => {
  const { username, tagline } = req.params;
  const { updateClicked } = req.query;

  try {
    // 1. Get PUUID from Riot ID using utility function
    const riotIdData = await getRiotId(username, tagline);
    const puuid = riotIdData.puuid;

    // 2. Check if we have summoner in database first (skip if updateClicked is true)
    if (!updateClicked) {
      const existingSummoner = await Summoner.findOne({ puuid });
      if (existingSummoner) {
        return res.json({ summoner: existingSummoner });
      }
    }

    // 3. Get player info from PUUID using utility function
    const summonerData = await getSummonerByPuuid(puuid);

    // 4. Create or update player in MongoDB
    const dbSummoner = await Summoner.findOneAndUpdate(
      { puuid },
      {
        $set: {
          username,
          tagline,
          level: summonerData.summonerLevel,
          profileIconId: summonerData.profileIconId,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          puuid,
        },
      },
      { new: true, upsert: true }
    );

    // 5. Send info to client
    res.json({ summoner: dbSummoner });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Summoner Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
