const request = require("supertest");
const userModel = require("../src/models/user.model");

jest.mock("../src/services/ai.service.js", () => ({}));

const app = require("../src/app");

// checking express app working
describe("Express App", () => {

  test("should respond to a request", async () => {

    const response = await request(app)
      .get("/");

    expect(response.statusCode).not.toBe(500);
  });


});