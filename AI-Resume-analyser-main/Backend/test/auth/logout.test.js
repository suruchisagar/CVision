const request = require("supertest");

jest.mock("../../src/services/ai.service.js", () => ({}));

const app = require("../../src/app");

describe("GET /api/auth/logout", () => {

  test("should logout the user successfully", async () => {

    const response = await request(app)
      .post("/api/auth/logout");

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);
    console.log("Set-Cookie:", response.headers["set-cookie"]);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User logged out successfully");
  });

});