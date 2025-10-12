const { getMatchData, delay } = require("../../api/championApi");

// Helper for Riot API rate limiting
module.exports = async function riotBatchFetch(matchIds) {
  const results = [];
  let batch = [];
  let batchStart = Date.now();

  for (let i = 0; i < matchIds.length; i++) {
    batch.push(matchIds[i]);
    // 20 requests max per second
    if (batch.length === 20 || i === matchIds.length - 1) {
      const promises = batch.map((id) => getMatchData(id).catch(() => null));
      const batchResults = await Promise.all(promises);
      results.push(...batchResults.filter(Boolean));
      batch = [];
      // Wait to respect timing
      const elapsed = Date.now() - batchStart;
      if (elapsed < 1000) await delay(1000 - elapsed);
      batchStart = Date.now();
    }
    // Only wait 2 minutes if more than 100 matches
    if (matchIds.length > 100 && (i + 1) % 100 === 0) await delay(120000);
  }
  return results;
};
