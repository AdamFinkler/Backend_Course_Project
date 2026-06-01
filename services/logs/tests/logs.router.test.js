// Mock the database connection to prevent real DB access during tests.
jest.mock("../../../config/db", () => jest.fn());

// Mock the Log model so no real documents are created in the database.
jest.mock("../../../models/log.model", () => ({
  create: jest.fn().mockResolvedValue({}),
}));

// Mock the service layer to control its behavior in each test case.
jest.mock("../logs.service", () => ({
  getAllLogs: jest.fn(),
}));

// Supertest is used to send HTTP requests to the Express app.
const request = require("supertest");

// Express application under test.
const app = require("../logs.process");

// Import the mocked service function so we can configure its return values.
const { getAllLogs } =
    /** @type {{ getAllLogs: jest.Mock<Promise<any>> }} */
    (require("../logs.service"));

describe("logs.router", () => {

  // Reset all mock state before each test.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/logs", () => {

    it("returns all logs", async () => {

      // Simulate a successful service response with log records.
      getAllLogs.mockResolvedValue([
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

      // Send a GET request to the logs endpoint.
      const response = await request(app).get("/api/logs");

      // Verify that the endpoint responds with HTTP 200.
      expect(response.status).toBe(200);

      // Verify that the response body contains the expected logs.
      expect(response.body).toEqual([
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

    it("returns error with id and message when service fails", async () => {

      // Simulate a service failure.
      getAllLogs.mockRejectedValue(
          new Error("Database connection failed")
      );

      // Send a GET request to the logs endpoint.
      const response = await request(app).get("/api/logs");

      // Verify that the endpoint returns an internal server error.
      expect(response.status).toBe(500);

      // Verify that the error response matches the expected format.
      expect(response.body).toEqual({
        id: "SERVER_ERROR",
        message: "Database connection failed",
      });
    });
  });
});