const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

/* ----------------- Get Matchs History ------------- */
router.get("/:puuid", matchController.getMatchHistory);

/* ----------------- Get Match Details ------------- */
router.get("/details/:matchId", matchController.getMatchDetails);

module.exports = router;
