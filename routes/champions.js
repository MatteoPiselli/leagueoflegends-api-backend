const express = require("express");
const router = express.Router();
const championController = require("../controllers/championController");

router.get("/:puuid/stats", championController.getChampionStats);

module.exports = router;
