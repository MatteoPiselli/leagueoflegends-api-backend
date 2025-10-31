/**
 * Format match details from Riot API to database schema
 * @param {Object} matchDetailsData - Raw match details from Riot API
 * @returns {Object} Formatted match object for MongoDB
 */
function formatMatch(matchDetailsData) {
  return {
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
}

module.exports = { formatMatch };
