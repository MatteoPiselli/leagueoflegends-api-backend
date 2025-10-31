const matchDbService = require("./matchDbService");
const matchApiService = require("./matchApiService");
const { formatMatch } = require("../match/utils/formatMatch");

/**
 * Get match history for a player
 * @param {string} puuid - Player's PUUID
 * @param {boolean} forceUpdate - Whether to force update from Riot API
 * @returns {Object} Match history with match IDs
 */
const getMatchHistory = async (puuid, forceUpdate = false) => {
  if (!forceUpdate) {
    const dbMatches = await matchDbService.findRecentMatchesByPuuid(puuid, 5);
    if (dbMatches.length > 0) {
      const matchIds = dbMatches.map((match) => match.matchId);
      return { matchs: matchIds };
    }
  }
  const matchsHistoryData = await matchApiService.fetchMatchHistory(
    puuid,
    0,
    5
  );
  return { matchs: matchsHistoryData };
};

/**
 * Get detailed information about a specific match
 * @param {string} matchId - The match ID to fetch details for
 * @returns {Object} Match details with formatted response
 */
const getMatchDetails = async (matchId) => {
  const dbMatch = await matchDbService.findMatchById(matchId);
  if (dbMatch) {
    const formattedResponse = {
      metadata: {
        matchId: dbMatch.matchId,
      },
      info: {
        gameCreation: dbMatch.gameCreation,
        gameDuration: dbMatch.gameDuration,
        queueId: dbMatch.queueId,
        participants: dbMatch.participants,
        teams: dbMatch.teams,
      },
    };
    return { matchDetails: formattedResponse };
  }
  const matchDetailsData = await matchApiService.fetchMatchDetails(matchId);
  const formattedMatch = formatMatch(matchDetailsData);
  await matchDbService.saveMatch(formattedMatch);
  return { matchDetails: matchDetailsData };
};

module.exports = {
  getMatchDetails,
  getMatchHistory,
};
