const mongoose = require("mongoose");

const summonerSchema = new mongoose.Schema({
  username: String,
  tagline: String,
  puuid: String,
  level: Number,
  profileIconId: Number,
  updatedAt: { type: Date, default: Date.now },
});

summonerSchema.index({ puuid: 1 });

const Summoner = mongoose.model("summoners", summonerSchema);

module.exports = Summoner;
