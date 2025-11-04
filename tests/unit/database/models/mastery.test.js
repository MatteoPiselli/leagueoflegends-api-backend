const mongoose = require("mongoose");
const Mastery = require("../../../../database/models/mastery");

describe("Mastery model", () => {
  it("should have the correct schema structure", () => {
    const schemaPaths = Mastery.schema.paths;
    expect(schemaPaths.summoner).toBeDefined();
    expect(schemaPaths.championId).toBeDefined();
    expect(schemaPaths.championLevel).toBeDefined();
    expect(schemaPaths.championPoints).toBeDefined();
    expect(schemaPaths.updatedAt).toBeDefined();
  });

  it("should have an index on summoner", () => {
    const indexes = Mastery.schema.indexes();
    const hasSummonerIndex = indexes.some(([fields]) => fields.summoner === 1);
    expect(hasSummonerIndex).toBe(true);
  });

  it("should validate a valid mastery document", async () => {
    const doc = new Mastery({
      summoner: new mongoose.Types.ObjectId(),
      championId: 266,
      championLevel: 7,
      championPoints: 123456,
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it("should fail validation if fields have invalid types", async () => {
    const doc = new Mastery({
      summoner: "not-an-objectid",
      championId: "not-a-number",
      championLevel: "not-a-number",
      championPoints: "not-a-number",
    });
    await expect(doc.validate()).rejects.toThrow();
  });
});
