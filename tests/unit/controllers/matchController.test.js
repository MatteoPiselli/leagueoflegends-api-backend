const matchService = require("../../../services/match/matchService");
const {
  getMatchHistory,
  getMatchDetails,
} = require("../../../controllers/matchController");

// Mock response and request
const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("matchController.getMatchHistory", () => {
  it("should return an empty array if no matches are found", async () => {
    const mockResult = { matchs: [] };
    jest
      .spyOn(matchService, "getMatchHistory")
      .mockResolvedValueOnce(mockResult);

    await getMatchHistory(req, res);

    expect(matchService.getMatchHistory).toHaveBeenCalledWith(
      "test-puuid",
      false
    );
    expect(res.json).toHaveBeenCalledWith({ matchs: [] });
  });
  let req, res;

  beforeEach(() => {
    req = {
      params: { puuid: "test-puuid" },
      query: { updateClicked: "false" },
    };
    res = mockRes();
    jest.clearAllMocks();
  });

  it("should return match history on success", async () => {
    const mockResult = { matchs: ["1", "2"] };
    jest
      .spyOn(matchService, "getMatchHistory")
      .mockResolvedValueOnce(mockResult);

    await getMatchHistory(req, res);

    expect(matchService.getMatchHistory).toHaveBeenCalledWith(
      "test-puuid",
      false
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should set forceUpdate to true if updateClicked is 'true'", async () => {
    req.query = { updateClicked: "true" };
    const mockResult = { matchs: ["3", "4"] };
    jest
      .spyOn(matchService, "getMatchHistory")
      .mockResolvedValueOnce(mockResult);

    await getMatchHistory(req, res);

    expect(matchService.getMatchHistory).toHaveBeenCalledWith(
      "test-puuid",
      true
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should handle errors and return status code and message", async () => {
    const error = new Error("Not found");
    error.statusCode = 404;
    jest.spyOn(matchService, "getMatchHistory").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getMatchHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Match History Error:",
      "Not found",
      "Status:",
      404
    );
  });

  it("should default to status 500 if error has no statusCode", async () => {
    const error = new Error("Internal error");
    jest.spyOn(matchService, "getMatchHistory").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getMatchHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal error" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Match History Error:",
      "Internal error",
      "Status:",
      500
    );
  });
});

describe("matchController.getMatchDetails", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { matchId: "test-match-id" },
    };
    res = mockRes();
    jest.clearAllMocks();
  });

  it("should return match details on success", async () => {
    const mockResult = {
      matchDetails: { metadata: { matchId: "test-match-id" } },
    };
    jest
      .spyOn(matchService, "getMatchDetails")
      .mockResolvedValueOnce(mockResult);

    await getMatchDetails(req, res);

    expect(matchService.getMatchDetails).toHaveBeenCalledWith("test-match-id");
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should handle errors and return status code and message", async () => {
    const error = new Error("Not found");
    error.statusCode = 404;
    jest.spyOn(matchService, "getMatchDetails").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getMatchDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Match Details Error:",
      "Not found",
      "Status:",
      404
    );
  });

  it("should default to status 500 if error has no statusCode", async () => {
    const error = new Error("Internal error");
    jest.spyOn(matchService, "getMatchDetails").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getMatchDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal error" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Match Details Error:",
      "Internal error",
      "Status:",
      500
    );
  });
});
