const { getMatchIds } = require("../api/championApi");
const riotRateLimit = require("../utils/riotRateLimit");
const Summoner = require("../database/models/summoner");
const Champion = require("../database/models/champion");
const calculateChampionStats = require("./utils/calculateChampionStats");

/**
 * Get champion statistics for a player
 * @param {string} puuid - Player's PUUID
 * @param {string} queueType - Queue type (default: "400" for Normal Draft)
 * @param {boolean} forceUpdate - Whether to force update from Riot API
 * @returns {Object} Champion statistics
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
    const existingStats = await Champion.findOne({
      summoner: dbSummoner._id,
      queueType: queueType,
    });

    if (existingStats) {
      return { championStats: existingStats.championStats };
    }
  }

  // 3. Get data from Riot API
  const allMatchIds = await getMatchIds(puuid, 0, 100);

  // Get match data with Riot rate limit
  const matches = await riotRateLimit(allMatchIds);

  // Parse targetQueueType
  const parsedQueueType = Number(queueType);

  // Filter player games by queue type
  const playerGames = matches
    .filter((match) => {
      const info = match?.info;
      if (!info || !Array.isArray(info.participants)) return false;
      // Filter by specific queue type
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

  // Check if we have any games for this queue type
  if (playerGames.length === 0) {
    // Save empty stats to avoid repeated API calls
    await Champion.findOneAndUpdate(
      {
        summoner: dbSummoner._id,
        queueType: queueType,
      },
      {
        $set: {
          championStats: [],
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return { championStats: [] };
  }

  // Calculate champion statistics
  const stats = calculateChampionStats(playerGames);

  // 4. Save/Update champion stats in MongoDB
  const updatedChampionStats = await Champion.findOneAndUpdate(
    {
      summoner: dbSummoner._id,
      queueType: queueType,
    },
    {
      $set: {
        championStats: stats,
        updatedAt: new Date(),
      },
    },
    // Create if not exists, return the new document
    { upsert: true, new: true }
  );

  return { championStats: updatedChampionStats.championStats };
};

module.exports = {
  getChampionStats,
};
