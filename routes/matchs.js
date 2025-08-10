var express = require("express");
var router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

/* ----------------- Get Matchs History ------------- */
router.get("/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    // ------------- Retrieve the match history from the PUUID ---------- //
    const matchsHistoryResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${RIOT_API_KEY}`
    );

    if (!matchsHistoryResponse.ok) {
      const errorText = await matchsHistoryResponse.text();
      console.error("Error Matchs History:", errorText);

      // Return the same error code as the Riot API
      return res.status(matchsHistoryResponse.status).json({
        error: `Error Matchs History: ${matchsHistoryResponse.status}`,
        riotError: errorText,
      });
    }

    const matchsHistoryData = await matchsHistoryResponse.json();

    res.json({ matchs: matchsHistoryData });

    // Catch errors
  } catch (error) {
    console.error("Error backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ----------------- Get Match Details ------------- */
router.get("/details/:matchId", async (req, res) => {
  const { matchId } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    const matchDetailsResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
    );

    if (!matchDetailsResponse.ok) {
      const errorText = await matchDetailsResponse.text();
      console.error("Error Match Details:", errorText);

      // Return the same error code as the Riot API
      return res.status(matchDetailsResponse.status).json({
        error: `Error Match Details: ${matchDetailsResponse.status}`,
        riotError: errorText,
      });
    }

    const matchDetailsData = await matchDetailsResponse.json();

    res.json({ matchDetails: matchDetailsData });

    // Catch errors
  } catch (error) {
    console.error("Error backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ----------------- Get Champion Stats ------------- */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/champion-stats/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    const matchsResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100&api_key=${RIOT_API_KEY}`
    );

    if (!matchsResponse.ok) {
      const errorText = await matchsResponse.text();
      console.error("Error fetching matches:", errorText);

      // Return the same error code as the Riot API
      return res.status(matchsResponse.status).json({
        error: `Error fetching matches: ${matchsResponse.status}`,
        riotError: errorText,
      });
    }

    const matchIds = await matchsResponse.json();
    const championGames = {};

    // Process matches in batches to avoid rate limits
    const batchSize = 5;
    let analysisComplete = false;

    for (let i = 0; i < matchIds.length && !analysisComplete; i += batchSize) {
      const batch = matchIds.slice(i, i + batchSize);

      const batchPromises = batch.map(async (matchId, index) => {
        await delay(index * 50);

        try {
          const response = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
          );

          if (!response.ok) return null;
          const matchData = await response.json();

          return {
            ...matchData,
            gameCreation: matchData.info.gameCreation,
          };
        } catch (error) {
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Process the results of the batch
      batchResults.forEach((matchData) => {
        if (!matchData) return;

        const currentPlayerData = matchData.info.participants.find(
          (participant) => participant.puuid === puuid
        );

        if (currentPlayerData) {
          const championId = currentPlayerData.championId;

          // Initialize the champion if it doesn't exist
          if (!championGames[championId]) {
            championGames[championId] = {
              championId,
              championName: currentPlayerData.championName,
              games: [],
            };
          }

          const championData = championGames[championId];

          // Add this game if we have less than 20 games for this champion
          if (championData.games.length < 20) {
            championData.games.push({
              gameCreation: matchData.info.gameCreation,
              kills: currentPlayerData.kills,
              deaths: currentPlayerData.deaths,
              assists: currentPlayerData.assists,
              cs: currentPlayerData.totalMinionsKilled,
              win: currentPlayerData.win,
            });

            championData.games.sort((a, b) => b.gameCreation - a.gameCreation);

            // Limit to the most recent 20 games
            if (championData.games.length > 20) {
              championData.games = championData.games.slice(0, 20);
            }
          }
        }
      });

      // Check if we have enough data for the 3 most played champions
      const championsWithEnoughGames = Object.values(championGames)
        .filter((champion) => champion.games.length >= 3)
        .sort((a, b) => b.games.length - a.games.length);

      if (championsWithEnoughGames.length >= 3) {
        analysisComplete = true;
        break;
      }

      // Delay between batches to avoid rate limits
      if (i + batchSize < matchIds.length) {
        await delay(200);
      }
    }

    // Calculate champion stats
    const allChampions = Object.values(championGames);
    const championStats = allChampions
      .filter((champion) => champion.games.length >= 3)
      .map((champion) => {
        const games = champion.games;
        const totalGames = games.length;

        // Calculate averages
        const totalKills = games.reduce((sum, game) => sum + game.kills, 0);
        const totalDeaths = games.reduce((sum, game) => sum + game.deaths, 0);
        const totalAssists = games.reduce((sum, game) => sum + game.assists, 0);
        const totalCs = games.reduce((sum, game) => sum + game.cs, 0);
        const wins = games.filter((game) => game.win).length;

        const avgKills = totalKills / totalGames;
        const avgDeaths = totalDeaths / totalGames;
        const avgAssists = totalAssists / totalGames;
        const avgCs = totalCs / totalGames;
        const winRate = (wins / totalGames) * 100;
        const kda =
          avgDeaths > 0
            ? (avgKills + avgAssists) / avgDeaths
            : avgKills + avgAssists;

        return {
          championId: champion.championId,
          championName: champion.championName,
          games: totalGames,
          winRate: Math.round(winRate),
          averageStats: {
            kills: Math.round(avgKills * 10) / 10,
            deaths: Math.round(avgDeaths * 10) / 10,
            assists: Math.round(avgAssists * 10) / 10,
            kda: Math.round(kda * 100) / 100,
            cs: Math.round(avgCs),
          },
        };
      })
      .sort((a, b) => b.games - a.games)
      .slice(0, 3);

    res.json({ championStats: championStats });
  } catch (error) {
    console.error("Error backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
