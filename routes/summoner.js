var express = require("express");
var router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

/* ----------------- Search player ------------- */
router.get("/:username/:tagline", async (req, res) => {
  const { username, tagline } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    // 1 - Récupération du PUUID du joueur à partir du Riot ID
    const riotIdResponse = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}?api_key=${RIOT_API_KEY}`
    );

    if (!riotIdResponse.ok) {
      const errorText = await riotIdResponse.text();
      console.error("Erreur Riot ID:", errorText);
      throw new Error(`Erreur Riot ID: ${riotIdResponse.status}`);
    }

    const riotIdData = await riotIdResponse.json();
    const puuid = riotIdData.puuid;

    // 2 - Récupération des informations supplémentaires du joueur à partir de son PUUID (Icon, niveau, etc.)
    const summonerResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`
    );

    if (!summonerResponse.ok) {
      const errorText = await summonerResponse.text();
      console.error("Erreur Summoner Info:", errorText);
      throw new Error(`Erreur Summoner Info: ${summonerResponse.status}`);
    }

    const summonerData = await summonerResponse.json();

    // 3 - Fusion des données
    res.json({ riotId: riotIdData, summoner: summonerData });

    // Capture des erreurs
  } catch (error) {
    console.error("Erreur backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
