const Match = require("../../database/models/match");

/**
 * Find a match by its ID in the database
 * @param {string} matchId
 * @returns {Object|null}
 */
async function findMatchById(matchId) {
  return await Match.findOne({ matchId });
}

/**
 * Find recent matches for a player by PUUID
 * @param {string} puuid
 * @param {number} limit
 * @returns {Array}
 */
async function findRecentMatchesByPuuid(puuid, limit = 5) {
  return await Match.find({ "participants.puuid": puuid })
    .sort({ gameCreation: -1 })
    .limit(limit)
    .select("matchId");
}

/**
 * Save a match to the database
 * @param {Object} matchData
 * @returns {Object}
 */
async function saveMatch(matchData) {
  const newMatch = new Match(matchData);
  return await newMatch.save();
}

module.exports = {
  findMatchById,
  findRecentMatchesByPuuid,
  saveMatch,
};
