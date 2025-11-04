const masteryService = require("../../../services/mastery/masteryService");
const { getMasteries } = require("../../../controllers/masteryController");

// Mock response and request
const mockRes = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("masteryController.getMasteries", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { puuid: "test-puuid" },
      query: { updateClicked: "false" },
    };
    res = mockRes();
    jest.clearAllMocks();
  });

  it("should return masteries on success", async () => {
    const mockResult = { masteries: [{ championId: 1, mastery: 100 }] };
    jest
      .spyOn(masteryService, "getMasteries")
      .mockResolvedValueOnce(mockResult);

    await getMasteries(req, res);

    expect(masteryService.getMasteries).toHaveBeenCalledWith(
      "test-puuid",
      false
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should set forceUpdate to true if updateClicked is 'true'", async () => {
    req.query = { updateClicked: "true" };
    const mockResult = { masteries: [{ championId: 2, mastery: 200 }] };
    jest
      .spyOn(masteryService, "getMasteries")
      .mockResolvedValueOnce(mockResult);

    await getMasteries(req, res);

    expect(masteryService.getMasteries).toHaveBeenCalledWith(
      "test-puuid",
      true
    );
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("should handle errors and return status code and message", async () => {
    const error = new Error("Not found");
    error.statusCode = 404;
    jest.spyOn(masteryService, "getMasteries").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getMasteries(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Masteries Error:",
      "Not found",
      "Status:",
      404
    );
  });

  it("should default to status 500 if error has no statusCode", async () => {
    const error = new Error("Internal error");
    jest.spyOn(masteryService, "getMasteries").mockRejectedValueOnce(error);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getMasteries(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal error" });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Masteries Error:",
      "Internal error",
      "Status:",
      500
    );
  });
});
