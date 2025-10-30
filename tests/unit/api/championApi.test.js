const { getMatchIds, getMatchData } = require("../../../api/championApi");

// Mock fetch globally
global.fetch = jest.fn();

describe("championApi", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("getMatchIds", () => {
    it("should return match IDs on successful response", async () => {
      const mockMatchIds = ["MATCH1", "MATCH2", "MATCH3"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockMatchIds),
      });

      const result = await getMatchIds("test-puuid");

      expect(fetch).toHaveBeenCalledWith(
        "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/test-puuid/ids?start=0&count=100&api_key=test-api-key"
      );
      expect(result).toEqual(mockMatchIds);
    });

    it("should use custom start and count parameters", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([]),
      });

      await getMatchIds("test-puuid", 20, 50);

      expect(fetch).toHaveBeenCalledWith(
        "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/test-puuid/ids?start=20&count=50&api_key=test-api-key"
      );
    });

    it("should throw error with status code on failed response", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValueOnce("Not Found"),
      });

      await expect(getMatchIds("invalid-puuid")).rejects.toThrow(
        "Match IDs error: 404 - Not Found"
      );
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getMatchIds("test-puuid")).rejects.toThrow("Network error");
    });
  });

  describe("getMatchData", () => {
    it("should return match data on successful response", async () => {
      const mockMatchData = {
        matchId: "MATCH1",
        info: { gameCreation: 1234567890 },
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockMatchData),
      });

      const result = await getMatchData("MATCH1");

      expect(fetch).toHaveBeenCalledWith(
        "https://europe.api.riotgames.com/lol/match/v5/matches/MATCH1?api_key=test-api-key"
      );
      expect(result).toEqual(mockMatchData);
    });

    it("should throw error with status code on failed response", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: jest.fn().mockResolvedValueOnce("Forbidden"),
      });

      await expect(getMatchData("invalid-match-id")).rejects.toThrow(
        "Match Data error: 403 - Forbidden"
      );
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Connection timeout"));

      await expect(getMatchData("MATCH1")).rejects.toThrow(
        "Connection timeout"
      );
    });
  });
});
