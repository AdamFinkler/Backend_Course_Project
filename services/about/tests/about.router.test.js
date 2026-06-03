jest.mock("../../../config/db", () => jest.fn().mockResolvedValue());

jest.mock("../../../models/log.model", () => ({
  create: jest.fn().mockResolvedValue({}),
}));

jest.mock("../about.service");

const request = require("supertest");
const app = require("../about.process");

const { getDevelopersTeam } = require("../about.service");

describe("about.router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/about returns developers team", async () => {
    getDevelopersTeam.mockReturnValue([
      {
        first_name: "Adam",
        last_name: "Finkler",
      },
    ]);

    const response = await request(app).get("/api/about");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        first_name: "Adam",
        last_name: "Finkler",
      },
    ]);
  });
});
