jest.mock("../../../models/log.model", () => ({
  find: jest.fn(),
}));

const Log = /** @type {{ find: jest.Mock<Promise<any>> }} */ (require("../../../models/log.model"));
const { getAllLogs } = require("../logs.service");

describe("logs.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllLogs", () => {
    it("returns all log documents", async () => {
      Log.find.mockResolvedValue([
        {
          method: "GET",
          endpoint: "/api/costs/report",
          status_code: 200,
          message: "Request processed for /api/costs/report",
        },
        {
          method: "POST",
          endpoint: "/api/costs/add",
          status_code: 201,
          message: "Request processed for /api/costs/add",
        },
      ]);

      const result = await getAllLogs();

      expect(Log.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          method: "GET",
          endpoint: "/api/costs/report",
          status_code: 200,
          message: "Request processed for /api/costs/report",
        },
        {
          method: "POST",
          endpoint: "/api/costs/add",
          status_code: 201,
          message: "Request processed for /api/costs/add",
        },
      ]);
    });

    it("returns empty array when no logs exist", async () => {
      Log.find.mockResolvedValue([]);

      const result = await getAllLogs();

      expect(result).toEqual([]);
    });

    it("throws when database query fails", async () => {
      Log.find.mockRejectedValue(new Error("Database connection failed"));

      await expect(getAllLogs()).rejects.toThrow("Database connection failed");
    });
  });
});
