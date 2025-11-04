const Match = require("../../../../database/models/match");

describe("Match model", () => {
  it("should have the correct schema structure", () => {
    const schemaPaths = Match.schema.paths;
    expect(schemaPaths.matchId).toBeDefined();
    expect(schemaPaths.gameCreation).toBeDefined();
    expect(schemaPaths.gameDuration).toBeDefined();
    expect(schemaPaths.queueId).toBeDefined();
    expect(schemaPaths.result).toBeDefined();
    expect(schemaPaths.participants).toBeDefined();
    expect(schemaPaths.teams).toBeDefined();
    expect(schemaPaths.updatedAt).toBeDefined();
  });

  it("should have the expected indexes", () => {
    const indexes = Match.schema.indexes();
    const hasPuuidIndex = indexes.some(
      ([fields]) => fields["participants.puuid"] === 1
    );
    const hasGameCreationIndex = indexes.some(
      ([fields]) => fields.gameCreation === -1
    );
    const hasMatchIdIndex = indexes.some(([fields]) => fields.matchId === 1);
    expect(hasPuuidIndex).toBe(true);
    expect(hasGameCreationIndex).toBe(true);
    expect(hasMatchIdIndex).toBe(true);
  });

  it("should validate a valid match document", async () => {
    const doc = new Match({
      matchId: "EUW1_1234567890",
      gameCreation: new Date(),
      gameDuration: 1800,
      queueId: 420,
      result: "Win",
      participants: [
        {
          puuid: "test-puuid",
          riotIdGameName: "Player1",
          riotIdTagline: "EUW",
          championId: 1,
          championName: "Aatrox",
          champLevel: 18,
          teamId: 100,
          win: true,
          kills: 10,
          deaths: 2,
          assists: 8,
          totalMinionsKilled: 200,
          neutralMinionsKilled: 20,
          goldEarned: 15000,
          visionScore: 30,
          totalDamageDealtToChampions: 30000,
          item0: 1055,
          item1: 3071,
          item2: 3047,
          item3: 6333,
          item4: 3075,
          item5: 3026,
          item6: 3363,
          summoner1Id: 4,
          summoner2Id: 14,
          perks: {
            styles: [
              {
                style: 8000,
                selections: [{ perk: 8005 }, { perk: 9111 }],
              },
            ],
          },
        },
      ],
      teams: [
        { teamId: 100, win: true },
        { teamId: 200, win: false },
      ],
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it("should fail validation if fields have invalid types", async () => {
    const doc = new Match({
      matchId: 123,
      gameCreation: "not-a-date",
      gameDuration: "not-a-number",
      queueId: "not-a-number",
      participants: [
        {
          puuid: 123,
          championId: "not-a-number",
        },
      ],
      teams: [{ teamId: "not-a-number", win: "not-a-boolean" }],
    });
    await expect(doc.validate()).rejects.toThrow();
  });
});
