const summonerService = require("../../../services/summoner/summonerService");
const { searchSummoner } = require("../../../controllers/summonerController");

// Mock response and request
const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("summonerController.searchSummoner", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { username: "testuser", tagline: "EUW" },
    };
    res = mockRes();
    jest.clearAllMocks();
  });

  it("should return summoner data on success", async () => {
    const mockResult = { summoner: { puuid: "abc", username: "testuser" } };
    jest
      .spyOn(summonerService, "searchSummoner")
      .mockResolvedValueOnce(mockResult);

    await searchSummoner(req, res);

    expect(summonerService.searchSummoner).toHaveBeenCalledWith(
      "testuser",
      "EUW"
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should handle errors and return status code and message", async () => {
    const error = new Error("Not found");
    error.statusCode = 404;
    jest.spyOn(summonerService, "searchSummoner").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await searchSummoner(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Summoner Error:",
      "Not found",
      "Status:",
      404
    );
  });

  it("should default to status 500 if error has no statusCode", async () => {
    const error = new Error("Internal error");
    jest.spyOn(summonerService, "searchSummoner").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await searchSummoner(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal error" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Summoner Error:",
      "Internal error",
      "Status:",
      500
    );
  });
});
