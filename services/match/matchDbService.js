const Match = require("../../database/models/match");

/**
 * Find a match by its ID in the database
 * @param {string} matchId
 * @returns {Object|null}
 */
function findMatchById(matchId) {
  return Match.findOne({ matchId });
}

/**
 * Find recent matches for a player by PUUID
 * @param {string} puuid
 * @param {number} limit
 * @returns {Array}
 */
function findRecentMatchesByPuuid(puuid, limit = 5) {
  return Match.find({ "participants.puuid": puuid })
    .sort({ gameCreation: -1 })
    .limit(limit)
    .select("matchId");
}

/**
 * Save a match to the database
 * @param {Object} matchData
 * @returns {Object}
 */
function saveMatch(matchData) {
  const newMatch = new Match(matchData);
  return newMatch.save();
}

module.exports = {
  findMatchById,
  findRecentMatchesByPuuid,
  saveMatch,
};
