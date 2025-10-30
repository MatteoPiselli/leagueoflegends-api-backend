const Summoner = require("../database/models/summoner");
const { getRiotId, getSummonerByPuuid } = require("../api/summonerApi");

/**
 * Search for a player using Riot API and return info
 * Save the player in MongoDB if not already present
 * Update profileIconId and level if the player is already present
 * @param {string} username - Player's username (gameName)
 * @param {string} tagline - Player's tagline
 * @returns {Object} Summoner data
 */
const searchSummoner = async (username, tagline) => {
  // 1. Check if we have summoner in database first
  const existingSummoner = await Summoner.findOne({ username, tagline });
  if (existingSummoner) {
    return { summoner: existingSummoner };
  }

  // 2. Get PUUID from Riot ID using utility function
  const riotIdData = await getRiotId(username, tagline);
  const puuid = riotIdData.puuid;

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

  return { summoner: dbSummoner };
};

module.exports = {
  searchSummoner,
};
