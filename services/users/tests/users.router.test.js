jest.mock("../../../config/db", () => jest.fn().mockResolvedValue());

jest.mock("../../../models/log.model", () => ({
  create: jest.fn().mockResolvedValue({}),
}));

jest.mock("../users.service");

const request = require("supertest");
const app = require("../users.process");

const { createUser, getAllUsers, getUserDetails } = require("../users.service");

describe("users.router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/add returns created user", async () => {
    createUser.mockResolvedValue({
      id: 123123,
      first_name: "Mosh",
      last_name: "Israeli",
      birthday: new Date("1995-05-10T00:00:00.000Z"),
    });

    const response = await request(app).post("/api/add").send({
      id: 123123,
      first_name: "Mosh",
      last_name: "Israeli",
      birthday: "1995-05-10",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 123123,
      first_name: "Mosh",
      last_name: "Israeli",
      birthday: "1995-05-10T00:00:00.000Z",
    });
  });

  it("GET /api/users returns all users", async () => {
    getAllUsers.mockResolvedValue([
      {
        id: 123123,
        first_name: "Mosh",
        last_name: "Israeli",
      },
    ]);

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 123123,
        first_name: "Mosh",
        last_name: "Israeli",
      },
    ]);
  });

  it("GET /api/users/:id returns user details", async () => {
    getUserDetails.mockResolvedValue({
      first_name: "Mosh",
      last_name: "Israeli",
      id: 123123,
      total: 40,
    });

    const response = await request(app).get("/api/users/123123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      first_name: "Mosh",
      last_name: "Israeli",
      id: 123123,
      total: 40,
    });
  });

  it("GET /api/users/:id returns 404 when user not found", async () => {
    const error = new Error("User not found");
    error.id = "USER_NOT_FOUND";

    getUserDetails.mockRejectedValue(error);

    const response = await request(app).get("/api/users/999999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      id: "USER_NOT_FOUND",
      message: "User not found",
    });
  });
});
