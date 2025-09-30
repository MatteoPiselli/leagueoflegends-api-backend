const Match = require("../models/match");
const { getMatchHistory, getMatchDetails } = require("../api/matchApi");

/**
 * Get match history for a player using their PUUID
 */
exports.getMatchHistory = async (req, res) => {
  const { puuid } = req.params;

  try {
    // Check if matches exist in database first
    const dbMatches = await Match.find({ "participants.puuid": puuid })
      .sort({ gameCreation: -1 })
      .limit(5)
      .select("matchId");

    if (dbMatches.length) {
      // Return matches from database
      const matchIds = dbMatches.map((match) => match.matchId);
      return res.json({ matchs: matchIds });
    }

    // Get match history from Riot API if not enough in DB
    const matchsHistoryData = await getMatchHistory(puuid, 0, 5);

    res.json({ matchs: matchsHistoryData });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Match History Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};

/**
 * Get detailed information for a specific match
 */
exports.getMatchDetails = async (req, res) => {
  const { matchId } = req.params;

  try {
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
      return res.json({ matchDetails: formattedResponse });
    }

    // Get match details from Riot API if not in DB
    const matchDetailsData = await getMatchDetails(matchId);

    // Save match to database
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

    // Save to database
    const newMatch = new Match(formattedMatch);
    await newMatch.save();

    // Return in the same format as Riot API for frontend compatibility
    res.json({ matchDetails: matchDetailsData });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Match Details Error:", error.message, "Status:", statusCode);
    res.status(statusCode).json({ error: error.message });
  }
};
