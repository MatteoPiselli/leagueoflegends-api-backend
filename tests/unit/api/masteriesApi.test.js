const { getMasteriesByPuuid } = require("../../../api/masteriesApi");

// Mock fetch globally
global.fetch = jest.fn();

describe("masteriesApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMasteriesByPuuid", () => {
    const mockPuuid = "test-puuid-123";
    const expectedUrl = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${mockPuuid}/?api_key=test-api-key`;

    it("should return masteries data limited to 3 champions when API call is successful", async () => {
      const mockMasteriesResponse = [
        {
          championId: 1,
          championLevel: 7,
          championPoints: 50000,
          otherField: "ignored",
        },
        {
          championId: 2,
          championLevel: 6,
          championPoints: 40000,
          otherField: "ignored",
        },
        {
          championId: 3,
          championLevel: 5,
          championPoints: 30000,
          otherField: "ignored",
        },
        {
          championId: 4,
          championLevel: 4,
          championPoints: 20000,
          otherField: "ignored",
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockMasteriesResponse),
      });

      const result = await getMasteriesByPuuid(mockPuuid);

      expect(fetch).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual([
        { championId: 1, championLevel: 7, championPoints: 50000 },
        { championId: 2, championLevel: 6, championPoints: 40000 },
        { championId: 3, championLevel: 5, championPoints: 30000 },
      ]);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when masteries data is null or undefined", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await getMasteriesByPuuid(mockPuuid);

      expect(result).toEqual([]);
    });

    it("should return empty array when masteries data is empty array", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await getMasteriesByPuuid(mockPuuid);

      expect(result).toEqual([]);
    });

    it("should handle fewer than 3 masteries correctly", async () => {
      const mockMasteriesResponse = [
        { championId: 1, championLevel: 7, championPoints: 50000 },
        { championId: 2, championLevel: 6, championPoints: 40000 },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockMasteriesResponse),
      });

      const result = await getMasteriesByPuuid(mockPuuid);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { championId: 1, championLevel: 7, championPoints: 50000 },
        { championId: 2, championLevel: 6, championPoints: 40000 },
      ]);
    });

    it("should throw error with status code when API call fails", async () => {
      const mockErrorText = "Unauthorized";
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValueOnce(mockErrorText),
      });

      try {
        await getMasteriesByPuuid(mockPuuid);
      } catch (error) {
        expect(error.message).toBe("Masteries error: 401 - Unauthorized");
        expect(error.statusCode).toBe(401);
      }
    });

    it("should throw error when fetch rejects", async () => {
      const networkError = new Error("Network error");
      fetch.mockRejectedValueOnce(networkError);

      await expect(getMasteriesByPuuid(mockPuuid)).rejects.toThrow(
        "Network error"
      );
    });
  });
});
