const { getRankedByPuuid } = require("../../../api/rankedApi");

// Mock fetch globally
global.fetch = jest.fn();

describe("rankedApi", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("getRankedByPuuid", () => {
    const testPuuid = "test-puuid-123";
    const expectedUrl = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${testPuuid}/?api_key=test-api-key`;

    it("should return ranked data with both Solo/Duo and Flex", async () => {
      const mockRankedData = [
        {
          queueType: "RANKED_SOLO_5x5",
          tier: "GOLD",
          rank: "II",
          leaguePoints: 75,
          wins: 45,
          losses: 32,
        },
        {
          queueType: "RANKED_FLEX_SR",
          tier: "SILVER",
          rank: "I",
          leaguePoints: 89,
          wins: 23,
          losses: 18,
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockRankedData),
      });

      const result = await getRankedByPuuid(testPuuid);

      expect(fetch).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockRankedData);
      expect(result).toHaveLength(2);
    });

    it("should return ranked data with Solo/Duo only", async () => {
      const mockRankedData = [
        {
          queueType: "RANKED_SOLO_5x5",
          tier: "PLATINUM",
          rank: "IV",
          leaguePoints: 12,
          wins: 78,
          losses: 65,
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockRankedData),
      });

      const result = await getRankedByPuuid(testPuuid);

      expect(fetch).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockRankedData);
      expect(result).toHaveLength(1);
      expect(result[0].queueType).toBe("RANKED_SOLO_5x5");
    });

    it("should return ranked data with Flex only", async () => {
      const mockRankedData = [
        {
          queueType: "RANKED_FLEX_SR",
          tier: "DIAMOND",
          rank: "III",
          leaguePoints: 34,
          wins: 25,
          losses: 19,
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockRankedData),
      });

      const result = await getRankedByPuuid(testPuuid);

      expect(fetch).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockRankedData);
      expect(result).toHaveLength(1);
      expect(result[0].queueType).toBe("RANKED_FLEX_SR");
    });

    it("should return empty array when player has no ranked data", async () => {
      const mockRankedData = [];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockRankedData),
      });

      const result = await getRankedByPuuid(testPuuid);

      expect(fetch).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should throw error when API response is not ok", async () => {
      const errorText = "Not Found";
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValueOnce(errorText),
      });

      await expect(getRankedByPuuid(testPuuid)).rejects.toThrow(
        "Ranked response error: 404 - Not Found"
      );
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });

    it("should set statusCode on error object when API response fails", async () => {
      const errorText = "Unauthorized";
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValueOnce(errorText),
      });

      try {
        await getRankedByPuuid(testPuuid);
      } catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Ranked response error: 401 - Unauthorized");
      }
    });

    it("should handle player not found in ranked (404)", async () => {
      const errorText = "Data not found";
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValueOnce(errorText),
      });

      try {
        await getRankedByPuuid("unranked-player-puuid");
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(
          "Ranked response error: 404 - Data not found"
        );
      }
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getRankedByPuuid(testPuuid)).rejects.toThrow(
        "Network error"
      );
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
