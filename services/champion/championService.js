const championApiService = require("./championApiService");
const championDbService = require("./championDbService");
const { calculateChampionStats } = require("./utils/calculateChampionStats");
const { riotRateLimit } = require("../../utils/riotRateLimit");
const Summoner = require("../../database/models/summoner");

/**
 * Get champion statistics for a player
 * @param {string} puuid - Player's PUUID
 * @param {string} queueType - Queue type (default: "400" for Normal Draft)
 * @param {boolean} forceUpdate - Whether to force update from Riot API
 * @returns {Object} Champion statistics
 */

/**
 * Orchestrates fetching champion stats for a player
 */
const getChampionStats = async (
  puuid,
  queueType = "400",
  forceUpdate = false
) => {
  // 1. Find Summoner by PUUID
  const dbSummoner = await Summoner.findOne({ puuid });
  if (!dbSummoner) {
    const error = new Error("Summoner not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check if we have champion stats in database (skip if forceUpdate is true)
  if (!forceUpdate) {
    const existingStats = await championDbService.findChampionStats(
      dbSummoner._id,
      queueType
    );
    if (existingStats) {
      return { championStats: existingStats.championStats };
    }
  }

  // 3. Get data from Riot API
  const allMatchIds = await championApiService.fetchMatchIds(puuid, 0, 100);
  const matches = await riotRateLimit(allMatchIds);
  const parsedQueueType = Number(queueType);

  // Filter player games by queue type
  const playerGames = matches
    .filter((match) => {
      const info = match?.info;
      if (!info || !Array.isArray(info.participants)) return false;
      if (info.queueId !== parsedQueueType) return false;
      return info.participants.some((x) => x.puuid === puuid);
    })
    .map((match) => {
      const info = match.info;
      const p = info.participants.find((x) => x.puuid === puuid);
      return {
        ...p,
        win: p.win,
        queueId: info.queueId,
        gameDuration: info.gameDuration,
      };
    });

  // Check if we dont have any games for this queue type
  if (playerGames.length === 0) {
    await championDbService.saveChampionStats(dbSummoner._id, queueType, []);
    return { championStats: [] };
  }

  // Calculate champion statistics
  const stats = calculateChampionStats(playerGames);

  // 4. Save/Update champion stats in MongoDB
  const updatedChampionStats = await championDbService.saveChampionStats(
    dbSummoner._id,
    queueType,
    stats
  );

  return { championStats: updatedChampionStats.championStats };
};

module.exports = {
  getChampionStats,
};
