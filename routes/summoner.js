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

    // --------------- Retrieving the PUUID from the Riot ID ------------------ //
    const riotIdResponse = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}?api_key=${RIOT_API_KEY}`
    );

    if (!riotIdResponse.ok) {
      const errorText = await riotIdResponse.text();
      console.error("Error Riot ID:", errorText);

      // Return the same error code as the Riot API
      return res.status(riotIdResponse.status).json({
        error: `Error Riot ID: ${riotIdResponse.status}`,
        riotError: errorText,
      });
    }

    const riotIdData = await riotIdResponse.json();
    const puuid = riotIdData.puuid;

    // ----------- Retrieval of additional information from the player’s PUUID (Icon, level, etc.) ----------------- //
    const summonerResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`
    );

    if (!summonerResponse.ok) {
      const errorText = await summonerResponse.text();
      console.error("Error Summoner Info:", errorText);

      // Return the same error code as the Riot API
      return res.status(summonerResponse.status).json({
        error: `Error Summoner Info: ${summonerResponse.status}`,
        riotError: errorText,
      });
    }

    const summonerData = await summonerResponse.json();

    res.json({ riotId: riotIdData, summoner: summonerData });

    // Catch errors
  } catch (error) {
    console.error("Error backend :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
