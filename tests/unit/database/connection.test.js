jest.mock("mongoose", () => ({
  connect: jest.fn(() => Promise.resolve()),
  connection: { close: jest.fn(() => Promise.resolve()) },
}));

describe("database/connection.js", () => {
  let mongoose;

  beforeEach(() => {
    jest.resetModules();
    process.env.CONNECTION_STRING = "mongodb://localhost:27017/test";
    mongoose = require("mongoose");
    require("../../../database/connection");
  });

  it("should call mongoose.connect with the connection string", async () => {
    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/test",
      expect.objectContaining({ connectTimeoutMS: 2000 })
    );
  });

  it("should close the connection on SIGINT", async () => {
    const closeSpy = jest
      .spyOn(mongoose.connection, "close")
      .mockResolvedValue();
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    process.emit("SIGINT");

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(closeSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
    exitSpy.mockRestore();
  });
});
