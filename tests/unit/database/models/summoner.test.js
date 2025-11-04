const Summoner = require("../../../../database/models/summoner");

describe("Summoner model", () => {
  it("should have the correct schema structure", () => {
    const schemaPaths = Summoner.schema.paths;
    expect(schemaPaths.username).toBeDefined();
    expect(schemaPaths.tagline).toBeDefined();
    expect(schemaPaths.puuid).toBeDefined();
    expect(schemaPaths.level).toBeDefined();
    expect(schemaPaths.profileIconId).toBeDefined();
    expect(schemaPaths.updatedAt).toBeDefined();
  });

  it("should have an index on puuid", () => {
    const indexes = Summoner.schema.indexes();
    const hasPuuidIndex = indexes.some(([fields]) => fields.puuid === 1);
    expect(hasPuuidIndex).toBe(true);
  });

  it("should validate a valid summoner document", async () => {
    const doc = new Summoner({
      username: "Player1",
      tagline: "EUW",
      puuid: "some-puuid",
      level: 30,
      profileIconId: 1234,
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it("should fail validation if fields have invalid types", async () => {
    const doc = new Summoner({
      username: 123,
      tagline: 456,
      puuid: 789,
      level: "not-a-number",
      profileIconId: "not-a-number",
    });
    await expect(doc.validate()).rejects.toThrow();
  });
});
