var express = require("express");
var router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;

/* ----------------- Get Matchs History ------------- */
router.get("/:puuid", async (req, res) => {
  const { puuid } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    // ------------- Récupérer l'historique des matchs à partir du PUUID ---------- //
    const matchsHistoryResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${RIOT_API_KEY}`
    );

    if (!matchsHistoryResponse.ok) {
      const errorText = await matchsHistoryResponse.text();
      console.error("Erreur Matchs History:", errorText);
      throw new Error(`Erreur Matchs History: ${matchsHistoryResponse.status}`);
    }

    const matchsHistoryData = await matchsHistoryResponse.json();

    res.json({ matchs: matchsHistoryData });

    // Capture des erreurs
  } catch (error) {
    console.error("Erreur backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ----------------- Get Match Details ------------- */
router.get("/details/:matchId", async (req, res) => {
  const { matchId } = req.params;

  try {
    if (!RIOT_API_KEY) {
      return res.status(400).json({ error: "API KEY is required" });
    }

    const matchDetailsResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
    );

    if (!matchDetailsResponse.ok) {
      const errorText = await matchDetailsResponse.text();
      console.error("Erreur Match Details:", errorText);
      throw new Error(`Erreur Match Details: ${matchDetailsResponse.status}`);
    }

    const matchDetailsData = await matchDetailsResponse.json();

    res.json({ matchDetails: matchDetailsData });

    // Capture des erreurs
  } catch (error) {
    console.error("Erreur backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
