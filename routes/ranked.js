const express = require("express");
const router = express.Router();
const rankedController = require("../controllers/rankedController");

router.get("/:puuid", rankedController.getRanked);

module.exports = router;
