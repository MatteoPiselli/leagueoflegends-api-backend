var express = require("express");
var router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

/* ----------------- Get Ranked data ------------- */
router.get("/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    // Récupération des données de ranked à partir du PUUID
    const rankedResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}/?api_key=${RIOT_API_KEY}`
    );

    if (!rankedResponse.ok) {
      const errorText = await rankedResponse.text();
      console.error("Erreur Ranked response:", errorText);
      throw new Error(`Erreur Ranked response: ${rankedResponse.status}`);
    }

    const rankedData = await rankedResponse.json(); // Récupération des données JSON

    res.json({ ranked: rankedData });

    // Capture des erreurs
  } catch (error) {
    console.error("Erreur backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
