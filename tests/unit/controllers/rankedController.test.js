const rankedService = require("../../../services/ranked/rankedService");
const { getRanked } = require("../../../controllers/rankedController");

// Mock response and request
const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("rankedController.getRanked", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { puuid: "test-puuid" },
      query: { updateClicked: "false" },
    };
    res = mockRes();
    jest.clearAllMocks();
  });

  it("should return ranked data on success", async () => {
    const mockResult = { ranked: { soloDuo: {}, flex: {} } };
    jest.spyOn(rankedService, "getRanked").mockResolvedValueOnce(mockResult);

    await getRanked(req, res);

    expect(rankedService.getRanked).toHaveBeenCalledWith("test-puuid", false);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should set forceUpdate to true if updateClicked is 'true'", async () => {
    req.query = { updateClicked: "true" };
    const mockResult = { ranked: { soloDuo: {}, flex: {} } };
    jest.spyOn(rankedService, "getRanked").mockResolvedValueOnce(mockResult);

    await getRanked(req, res);

    expect(rankedService.getRanked).toHaveBeenCalledWith("test-puuid", true);
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should handle errors and return status code and message", async () => {
    const error = new Error("Not found");
    error.statusCode = 404;
    jest.spyOn(rankedService, "getRanked").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getRanked(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Ranked Error:",
      "Not found",
      "Status:",
      404
    );
  });

  it("should default to status 500 if error has no statusCode", async () => {
    const error = new Error("Internal error");
    jest.spyOn(rankedService, "getRanked").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getRanked(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal error" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Ranked Error:",
      "Internal error",
      "Status:",
      500
    );
  });
});
