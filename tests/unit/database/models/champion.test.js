const mongoose = require("mongoose");
const Champion = require("../../../../database/models/champion");

describe("Champion model", () => {
  it("should have the correct schema structure", () => {
    const schemaPaths = Champion.schema.paths;
    expect(schemaPaths.summoner).toBeDefined();
    expect(schemaPaths.queueType).toBeDefined();
    expect(schemaPaths.championStats).toBeDefined();
    expect(schemaPaths.updatedAt).toBeDefined();
  });

  it("should have a compound index on summoner and queueType", () => {
    const indexes = Champion.schema.indexes();
    const hasCompoundIndex = indexes.some(
      ([fields]) => fields.summoner === 1 && fields.queueType === 1
    );
    expect(hasCompoundIndex).toBe(true);
  });

  it("should validate a valid champion document", async () => {
    const doc = new Champion({
      summoner: new mongoose.Types.ObjectId(),
      queueType: "420",
      championStats: [
        {
          championId: 1,
          championName: "Aatrox",
          winRate: 60,
          totalGames: 10,
          averageStats: {
            kda: 3.5,
            kills: 7,
            deaths: 2,
            assists: 5,
            cs: 150,
            csPerMinute: 6.5,
          },
        },
      ],
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it("should fail validation if fields have invalid types", async () => {
    const doc = new Champion({
      summoner: "not-an-objectid",
      queueType: 123,
      championStats: [
        {
          championId: "not-a-number",
          winRate: "not-a-number",
          averageStats: { kda: "not-a-number" },
        },
      ],
    });
    await expect(doc.validate()).rejects.toThrow();
  });
});
