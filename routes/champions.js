const express = require("express");
const router = express.Router();
const championController = require("../controllers/champion");

/* ----------- Get Champion Stats for Top 5 Champions ----------- */
router.get("/:puuid/stats", championController.getChampionStats);

module.exports = router;
