var express = require("express");
var router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

/* ----------------- Get masteries ------------- */
router.get("/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    // 1 - Récupération des masteries du joueur à partir du PUUID
    const masteriesResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/?api_key=${RIOT_API_KEY}`
    );

    if (!masteriesResponse.ok) {
      const errorText = await masteriesResponse.text();
      console.error("Erreur Riot ID:", errorText);
      throw new Error(`Erreur Riot ID: ${masteriesResponse.status}`);
    }

    // 2 - Récupération des données des masteries en limitant à 3 champions

    const masteriesJson = await masteriesResponse.json(); // Récupération des données JSON

    const masteriesData = masteriesJson
      ? masteriesJson.slice(0, 3).map((mastery) => ({
          championId: mastery.championId,
          championLevel: mastery.championLevel,
          championPoints: mastery.championPoints,
        }))
      : [];

    res.json({ masteries: masteriesData });

    // Capture des erreurs
  } catch (error) {
    console.error("Erreur backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
