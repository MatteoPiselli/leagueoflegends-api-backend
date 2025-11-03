const championService = require("../../../services/champion/championService");
const { getChampionStats } = require("../../../controllers/championController");

// Mock response and request
const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("championController.getChampionStats", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { puuid: "test-puuid" },
      query: { queueType: "400", updateClicked: "false" },
    };
    res = mockRes();
    jest.clearAllMocks();
  });

  it("should return champion stats on success", async () => {
    const mockResult = { championStats: [{ championId: 1, winRate: 60 }] };
    jest
      .spyOn(championService, "getChampionStats")
      .mockResolvedValueOnce(mockResult);

    await getChampionStats(req, res);

    expect(championService.getChampionStats).toHaveBeenCalledWith(
      "test-puuid",
      "400",
      false
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should use default queueType if not provided", async () => {
    req.query = { updateClicked: "false" };
    const mockResult = { championStats: [] };
    jest
      .spyOn(championService, "getChampionStats")
      .mockResolvedValueOnce(mockResult);

    await getChampionStats(req, res);

    expect(championService.getChampionStats).toHaveBeenCalledWith(
      "test-puuid",
      "400",
      false
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should set forceUpdate to true if updateClicked is 'true'", async () => {
    req.query = { queueType: "420", updateClicked: "true" };
    const mockResult = { championStats: [] };
    jest
      .spyOn(championService, "getChampionStats")
      .mockResolvedValueOnce(mockResult);

    await getChampionStats(req, res);

    expect(championService.getChampionStats).toHaveBeenCalledWith(
      "test-puuid",
      "420",
      true
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should handle errors and return status code and message", async () => {
    const error = new Error("Not found");
    error.statusCode = 404;
    jest
      .spyOn(championService, "getChampionStats")
      .mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getChampionStats(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Champion Stats Error:",
      "Not found",
      "Status:",
      404
    );
  });

  it("should default to status 500 if error has no statusCode", async () => {
    const error = new Error("Internal error");
    jest
      .spyOn(championService, "getChampionStats")
      .mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getChampionStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal error" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Champion Stats Error:",
      "Internal error",
      "Status:",
      500
    );
  });
});
