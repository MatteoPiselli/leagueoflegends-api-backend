const mongoose = require("mongoose");

const championStatSchema = new mongoose.Schema({
  championId: Number,
  championName: String,
  winRate: Number,
  totalGames: Number,
  averageStats: {
    kda: Number,
    kills: Number,
    deaths: Number,
    assists: Number,
    cs: Number,
    csPerMinute: Number,
  },
});

const championStatsSchema = new mongoose.Schema({
  summoner: { type: mongoose.Schema.Types.ObjectId, ref: "summoners" },
  queueType: String,
  championStats: [championStatSchema],
  updatedAt: { type: Date, default: Date.now },
});

championStatsSchema.index({ summoner: 1, queueType: 1 });

const Champion = mongoose.model("champions", championStatsSchema);

module.exports = Champion;
