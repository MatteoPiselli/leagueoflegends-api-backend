const express = require("express");
const router = express.Router();
const masteryController = require("../controllers/masteryController");

router.get("/:puuid", masteryController.getMasteries);

module.exports = router;
