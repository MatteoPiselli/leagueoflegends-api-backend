const { getRiotId, getSummonerByPuuid } = require("../../../api/summonerApi");

// Mock fetch globally
global.fetch = jest.fn();

describe("summonerApi", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("getRiotId", () => {
    it("should return riot account data when API call is successful", async () => {
      const mockResponse = {
        puuid: "test-puuid",
        gameName: "testuser",
        tagLine: "EUW",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getRiotId("testuser", "EUW");

      expect(fetch).toHaveBeenCalledWith(
        "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/testuser/EUW?api_key=test-api-key"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when API call fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValueOnce("Not Found"),
      });

      await expect(getRiotId("nonexistent", "EUW")).rejects.toThrow(
        "Riot ID error: 404 - Not Found"
      );
    });

    it("should throw error with correct statusCode when API call fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: jest.fn().mockResolvedValueOnce("Forbidden"),
      });

      try {
        await getRiotId("testuser", "EUW");
      } catch (error) {
        expect(error.statusCode).toBe(403);
      }
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Connection timeout"));

      await expect(getRiotId("testuser", "EUW")).rejects.toThrow(
        "Connection timeout"
      );
    });
  });

  describe("getSummonerByPuuid", () => {
    it("should return summoner data when API call is successful", async () => {
      const mockResponse = {
        id: "summoner-id",
        puuid: "test-puuid",
        name: "TestSummoner",
        summonerLevel: 50,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getSummonerByPuuid("test-puuid");

      expect(fetch).toHaveBeenCalledWith(
        "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/test-puuid?api_key=test-api-key"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when API call fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValueOnce("Summoner not found"),
      });

      await expect(getSummonerByPuuid("invalid-puuid")).rejects.toThrow(
        "Summoner info error: 404 - Summoner not found"
      );
    });

    it("should throw error with correct statusCode when API call fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: jest.fn().mockResolvedValueOnce("Rate limit exceeded"),
      });

      try {
        await getSummonerByPuuid("test-puuid");
      } catch (error) {
        expect(error.statusCode).toBe(429);
      }
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getSummonerByPuuid("test-puuid")).rejects.toThrow(
        "Network error"
      );
    });
  });
});
