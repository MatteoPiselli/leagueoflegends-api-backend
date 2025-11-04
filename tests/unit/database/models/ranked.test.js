const mongoose = require("mongoose");
const Ranked = require("../../../../database/models/ranked");

describe("Ranked model", () => {
  it("should have the correct schema structure", () => {
    const schemaPaths = Ranked.schema.paths;
    expect(schemaPaths.summoner).toBeDefined();
    expect(Ranked.schema.tree.soloDuo).toBeDefined();
    expect(Ranked.schema.tree.flex).toBeDefined();
  });

  it("should have an index on summoner", () => {
    const indexes = Ranked.schema.indexes();
    const hasSummonerIndex = indexes.some(([fields]) => fields.summoner === 1);
    expect(hasSummonerIndex).toBe(true);
  });

  it("should validate a valid ranked document", async () => {
    const doc = new Ranked({
      summoner: new mongoose.Types.ObjectId(),
      soloDuo: {
        tier: "Gold",
        rank: "IV",
        lp: 50,
        wins: 20,
        losses: 15,
      },
      flex: {
        tier: "Silver",
        rank: "I",
        lp: 30,
        wins: 10,
        losses: 12,
      },
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it("should fail validation if fields have invalid types", async () => {
    const doc = new Ranked({
      summoner: "not-an-objectid",
      soloDuo: {
        tier: 123,
        lp: "not-a-number",
        wins: "not-a-number",
      },
      flex: {
        losses: "not-a-number",
      },
    });
    await expect(doc.validate()).rejects.toThrow();
  });
});
