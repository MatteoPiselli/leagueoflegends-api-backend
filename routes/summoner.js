const express = require("express");
const router = express.Router();
const summonerController = require("../controllers/summonerController");

router.get("/:username/:tagline", summonerController.searchSummoner);

module.exports = router;
