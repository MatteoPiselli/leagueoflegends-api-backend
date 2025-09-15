const mongoose = require("mongoose");

const summonerSchema = mongoose.Schema({
  username: String,
  tagline: String,
  puuid: String,
  level: Number,
  profileIconId: Number,
  updatedAt: { type: Date, default: Date.now },
});

const Summoner = mongoose.model("summoners", summonerSchema);

module.exports = Summoner;
