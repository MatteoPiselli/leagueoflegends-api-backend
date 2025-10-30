const { getMatchHistory, getMatchDetails } = require("../../../api/matchApi");

// Mock fetch globally
global.fetch = jest.fn();

describe("matchApi", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("getMatchHistory", () => {
    it("should fetch match history successfully with default parameters", async () => {
      const mockMatchIds = ["match1", "match2", "match3"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMatchIds),
      });

      const result = await getMatchHistory("test-puuid");

      expect(fetch).toHaveBeenCalledWith(
        "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/test-puuid/ids?start=0&count=5&api_key=test-api-key"
      );
      expect(result).toEqual(mockMatchIds);
    });

    it("should fetch match history with custom parameters", async () => {
      const mockMatchIds = ["match1", "match2"];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMatchIds),
      });

      await getMatchHistory("test-puuid", 10, 20);

      expect(fetch).toHaveBeenCalledWith(
        "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/test-puuid/ids?start=10&count=20&api_key=test-api-key"
      );
    });

    it("should throw error when API request fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue("Not Found"),
      });

      await expect(getMatchHistory("invalid-puuid")).rejects.toThrow(
        "Match History error: 404 - Not Found"
      );
    });

    it("should throw error with correct status code", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: jest.fn().mockResolvedValue("Forbidden"),
      });

      try {
        await getMatchHistory("test-puuid");
      } catch (error) {
        expect(error.statusCode).toBe(403);
      }
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getMatchHistory("test-puuid")).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getMatchDetails", () => {
    it("should fetch match details successfully", async () => {
      const mockMatchDetails = { matchId: "match1", gameMode: "CLASSIC" };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMatchDetails),
      });

      const result = await getMatchDetails("match1");

      expect(fetch).toHaveBeenCalledWith(
        "https://europe.api.riotgames.com/lol/match/v5/matches/match1?api_key=test-api-key"
      );
      expect(result).toEqual(mockMatchDetails);
    });

    it("should throw error when API request fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue("Match not found"),
      });

      await expect(getMatchDetails("invalid-match")).rejects.toThrow(
        "Match Details error: 404 - Match not found"
      );
    });

    it("should throw error with correct status code", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue("Internal Server Error"),
      });

      try {
        await getMatchDetails("match1");
      } catch (error) {
        expect(error.statusCode).toBe(500);
      }
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Connection timeout"));

      await expect(getMatchDetails("match1")).rejects.toThrow(
        "Connection timeout"
      );
    });
  });
});
