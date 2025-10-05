const mongoose = require("mongoose");

const rankedSchema = new mongoose.Schema({
  summoner: { type: mongoose.Schema.Types.ObjectId, ref: "summoners" },
  soloDuo: {
    tier: String,
    rank: String,
    lp: Number,
    wins: Number,
    losses: Number,
    updatedAt: { type: Date, default: Date.now },
  },
  flex: {
    tier: String,
    rank: String,
    lp: Number,
    wins: Number,
    losses: Number,
    updatedAt: { type: Date, default: Date.now },
  },
});

rankedSchema.index({ summoner: 1 });

const Ranked = mongoose.model("rankeds", rankedSchema);

module.exports = Ranked;
