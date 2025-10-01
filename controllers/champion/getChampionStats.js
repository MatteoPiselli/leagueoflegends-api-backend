const { getMatchIds } = require("../../api/championApi");
const riotBatchFetch = require("./riotBatchFetch");

module.exports = async (req, res) => {
  const { puuid } = req.params;
  const { queueType } = req.query;
  try {
    // Limit to 100 matches
    const allMatchIds = await getMatchIds(puuid, 0, 100);

    // Get match data with Riot rate limit
    const matches = await riotBatchFetch(allMatchIds, puuid);

    // Filter player games and by queue type
    const playerGames = matches
      .map((match) => {
        if (queueType && match.info?.queueId != queueType) return null;
        const p = match.info?.participants?.find((x) => x.puuid === puuid);
        return p
          ? {
              ...p,
              win: p.win,
              queueId: match.info?.queueId,
              gameDuration: match.info?.gameDuration,
            }
          : null;
      })
      .filter(Boolean);

    // Count games per champion
    const championCounts = {};
    playerGames.forEach((game) => {
      championCounts[game.championId] =
        (championCounts[game.championId] || 0) + 1;
    });

    // Get top 5 most played champions
    const topChampions = Object.entries(championCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([championId]) => parseInt(championId));

    // Calculate stats for each champion
    const stats = topChampions.map((championId) => {
      const games = playerGames.filter((g) => g.championId === championId);
      const totalGames = games.length;
      const wins = games.filter((g) => g.win).length;
      const kills = games.reduce((sum, g) => sum + g.kills, 0);
      const deaths = games.reduce((sum, g) => sum + g.deaths, 0);
      const assists = games.reduce((sum, g) => sum + g.assists, 0);
      const cs = games.reduce(
        (sum, g) => sum + (g.totalMinionsKilled + g.neutralMinionsKilled),
        0
      );
      const csPerMinute = games.reduce(
        (sum, g) =>
          sum +
          (g.totalMinionsKilled + g.neutralMinionsKilled) /
            (g.gameDuration / 60),
        0
      );
      const kda = deaths > 0 ? (kills + assists) / deaths : kills + assists;
      const winRate =
        totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

      return {
        championId,
        championName: games[0]?.championName || "",
        winRate,
        totalGames,
        averageStats: {
          kda: +kda.toFixed(2),
          kills: +(kills / totalGames).toFixed(1),
          deaths: +(deaths / totalGames).toFixed(1),
          assists: +(assists / totalGames).toFixed(1),
          cs: +(cs / totalGames).toFixed(0),
          csPerMinute: +(csPerMinute / totalGames).toFixed(1),
        },
      };
    });

    res.json({ championStats: stats });
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
