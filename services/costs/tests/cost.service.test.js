jest.mock("../../../models/user.model");
jest.mock("../../../models/cost.model");
jest.mock("../../../models/report.model");

const User = require("../../../models/user.model");
const Cost = require("../../../models/cost.model");
const Report = require("../../../models/report.model");
const { createCost, getMonthlyReport } = require("../cost.service");

describe("cost.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCost", () => {
    it("creates a cost when data is valid", async () => {
      User.findOne.mockResolvedValue({ id: 123123 });
      Cost.create.mockResolvedValue({
        description: "choco",
        category: "food",
        userid: 123123,
        sum: 12,
        created_at: new Date("2026-05-25T10:00:00.000Z"),
      });

      const result = await createCost({
        description: "choco",
        category: "food",
        userid: 123123,
        sum: 12,
      });

      expect(result).toEqual({
        description: "choco",
        category: "food",
        userid: 123123,
        sum: 12,
        created_at: new Date("2026-05-25T10:00:00.000Z"),
      });
    });

    it("throws when user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        createCost({
          description: "choco",
          category: "food",
          userid: 999999,
          sum: 12,
        }),
      ).rejects.toMatchObject({
        id: "USER_NOT_FOUND",
        message: "User not found",
      });
    });

    it("throws when category is invalid", async () => {
      await expect(
        createCost({
          description: "choco",
          category: "travel",
          userid: 123123,
          sum: 12,
        }),
      ).rejects.toMatchObject({
        id: "INVALID_CATEGORY",
      });
    });

    it("throws when date is in the past", async () => {
      User.findOne.mockResolvedValue({ id: 123123 });

      await expect(
        createCost({
          description: "choco",
          category: "food",
          userid: 123123,
          sum: 12,
          created_at: "2020-01-01T00:00:00.000Z",
        }),
      ).rejects.toMatchObject({
        id: "PAST_DATE_NOT_ALLOWED",
      });
    });
  });

  describe("getMonthlyReport", () => {
    it("returns cached report for a past month", async () => {
      User.findOne.mockResolvedValue({ id: 123123 });
      Report.findOne.mockResolvedValue({
        userid: 123123,
        year: 2020,
        month: 1,
        costs: [{ food: [] }],
      });

      const result = await getMonthlyReport(123123, 2020, 1);

      expect(result).toEqual({
        userid: 123123,
        year: 2020,
        month: 1,
        costs: [{ food: [] }],
      });
      expect(Cost.find).not.toHaveBeenCalled();
    });

    it("throws when query params are missing", async () => {
      await expect(getMonthlyReport(123123, 2025)).rejects.toMatchObject({
        id: "MISSING_FIELDS",
      });
    });
  });
});
