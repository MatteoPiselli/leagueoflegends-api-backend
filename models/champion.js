const mongoose = require("mongoose");

const championSchema = mongoose.Schema({
  summoner: { type: mongoose.Schema.Types.ObjectId, ref: "summoners" },
  championId: Number,
  championName: String,
  totalGames: Number,
  winRate: Number,
  averageStats: {
    kills: Number,
    deaths: Number,
    assists: Number,
    kda: Number,
    cs: Number,
  },
  recentGames: [
    {
      gameCreation: Date,
      kills: Number,
      deaths: Number,
      assists: Number,
      cs: Number,
      win: Boolean,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

championSchema.index({ summoner: 1 });

const Champion = mongoose.model("champions", championSchema);

module.exports = Champion;
