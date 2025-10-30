const Match = require("../database/models/match");
const {
  getMatchDetails: getRiotMatchDetails,
  getMatchHistory: getRiotMatchHistory,
} = require("../api/matchApi");

/**
 * Get match history for a player
 * @param {string} puuid - Player's PUUID
 * @param {boolean} forceUpdate - Whether to force update from Riot API
 * @returns {Object} Match history with match IDs
 */
const getMatchHistory = async (puuid, forceUpdate = false) => {
  // Check if we have matches in database first (skip if forceUpdate is true)
  if (!forceUpdate) {
    const dbMatches = await Match.find({ "participants.puuid": puuid })
      .sort({ gameCreation: -1 })
      .limit(5)
      .select("matchId");

    if (dbMatches.length > 0) {
      // Return matches from database
      const matchIds = dbMatches.map((match) => match.matchId);
      return { matchs: matchIds };
    }
  }

  // Get match history from Riot API
  const matchsHistoryData = await getRiotMatchHistory(puuid, 0, 5);

  return { matchs: matchsHistoryData };
};

/**
 * Get detailed information about a specific match
 * @param {string} matchId - The match ID to fetch details for
 * @returns {Object} Match details with formatted response
 */
const getMatchDetails = async (matchId) => {
  // Check if match exists in database first
  let dbMatch = await Match.findOne({ matchId });

  if (dbMatch) {
    // Return data in the same format as Riot API
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

  // Get match details from Riot API if not in database
  const matchDetailsData = await getRiotMatchDetails(matchId);

  // Formatting match data to save in database
  const formattedMatch = {
    matchId: matchDetailsData.metadata.matchId,
    gameCreation: new Date(matchDetailsData.info.gameCreation),
    gameDuration: matchDetailsData.info.gameDuration,
    queueId: matchDetailsData.info.queueId,
    participants: matchDetailsData.info.participants.map((participant) => ({
      puuid: participant.puuid,
      riotIdGameName: participant.riotIdGameName,
      riotIdTagline: participant.riotIdTagline,
      championId: participant.championId,
      championName: participant.championName,
      champLevel: participant.champLevel,
      teamId: participant.teamId,
      win: participant.win,
      kills: participant.kills,
      deaths: participant.deaths,
      assists: participant.assists,
      totalMinionsKilled: participant.totalMinionsKilled,
      neutralMinionsKilled: participant.neutralMinionsKilled,
      goldEarned: participant.goldEarned,
      visionScore: participant.visionScore,
      totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
      item0: participant.item0,
      item1: participant.item1,
      item2: participant.item2,
      item3: participant.item3,
      item4: participant.item4,
      item5: participant.item5,
      item6: participant.item6,
      summoner1Id: participant.summoner1Id,
      summoner2Id: participant.summoner2Id,
      perks: participant.perks,
    })),
    teams: matchDetailsData.info.teams.map((team) => ({
      teamId: team.teamId,
      win: team.win,
    })),
  };

  // Save match to database
  const newMatch = new Match(formattedMatch);
  await newMatch.save();

  return { matchDetails: matchDetailsData };
};

module.exports = {
  getMatchDetails,
  getMatchHistory,
};
