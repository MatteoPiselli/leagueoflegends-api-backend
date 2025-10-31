const summonerDbService = require("./summonerDbService");
const summonerApiService = require("./summonerApiService");

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
  const existingSummoner = await summonerDbService.findSummonerByNameAndTag(
    username,
    tagline
  );
  if (existingSummoner) {
    return { summoner: existingSummoner };
  }

  // 2. Get PUUID from Riot ID
  const riotIdData = await summonerApiService.fetchRiotId(username, tagline);
  const puuid = riotIdData.puuid;

  // 3. Get player info from PUUID
  const summonerData = await summonerApiService.fetchSummonerByPuuid(puuid);

  // 4. Create or update player in MongoDB
  const dbSummoner = await summonerDbService.saveOrUpdateSummoner(puuid, {
    username,
    tagline,
    level: summonerData.summonerLevel,
    profileIconId: summonerData.profileIconId,
  });

  return { summoner: dbSummoner };
};

module.exports = {
  searchSummoner,
};
