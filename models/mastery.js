const mongoose = require("mongoose");

const masterySchema = mongoose.Schema({
  summoner: { type: mongoose.Schema.Types.ObjectId, ref: "summoners" },
  championId: Number,
  championLevel: Number,
  championPoints: Number,
  updatedAt: { type: Date, default: Date.now },
});

const Mastery = mongoose.model("masteries", masterySchema);

module.exports = Mastery;
