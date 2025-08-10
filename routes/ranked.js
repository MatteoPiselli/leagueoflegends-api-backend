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

    // ------------- Retrieve the match history from the PUUID ---------- //
    const rankedResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}/?api_key=${RIOT_API_KEY}`
    );

    if (!rankedResponse.ok) {
      const errorText = await rankedResponse.text();
      console.error("Error Ranked response:", errorText);

      // Return the same error code as the Riot API
      return res.status(rankedResponse.status).json({
        error: `Error Ranked response: ${rankedResponse.status}`,
        riotError: errorText,
      });
    }

    const rankedData = await rankedResponse.json();

    res.json({ ranked: rankedData });

    // Catch errors
  } catch (error) {
    console.error("Error backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
