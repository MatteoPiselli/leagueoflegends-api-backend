const express = require("express");
const router = express.Router();
const championController = require("../controllers/championController");

/* ----------------- Get Champion Stats ------------- */
router.get("/stats/:puuid", championController.getChampionStats);

module.exports = router;
