const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  puuid: String,
  riotIdGameName: String,
  riotIdTagline: String,
  championId: Number,
  championName: String,
  champLevel: Number,
  teamId: Number,
  win: Boolean,
  kills: Number,
  deaths: Number,
  assists: Number,
  totalMinionsKilled: Number,
  neutralMinionsKilled: Number,
  goldEarned: Number,
  visionScore: Number,
  totalDamageDealtToChampions: Number,
  item0: Number,
  item1: Number,
  item2: Number,
  item3: Number,
  item4: Number,
  item5: Number,
  item6: Number,
  summoner1Id: Number,
  summoner2Id: Number,
  perks: {
    styles: [
      {
        style: Number,
        selections: [
          {
            perk: Number,
          },
        ],
      },
    ],
  },
});

const teamSchema = new mongoose.Schema({
  teamId: Number,
  win: Boolean,
});

const matchSchema = new mongoose.Schema({
  matchId: String,
  gameCreation: Date,
  gameDuration: Number,
  queueId: Number,
  result: String,
  participants: [participantSchema],
  teams: [teamSchema],
  updatedAt: { type: Date, default: Date.now },
});

matchSchema.index({ "participants.puuid": 1 });
matchSchema.index({ gameCreation: -1 });
matchSchema.index({ matchId: 1 });

const Match = mongoose.model("matches", matchSchema);

module.exports = Match;
