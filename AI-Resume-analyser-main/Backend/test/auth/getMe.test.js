const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../../src/services/ai.service.js", () => ({}));

const userModel = require("../../src/models/user.model");
const tokenBlacklistModel = require("../../src/models/blacklist.model");

const app = require("../../src/app");

describe("GET /api/auth/get-me", () => {

  beforeEach(async () => {
    await userModel.deleteMany({
      $or: [
        { username: "getmetest" },
        { email: "getmetest@example.com" }
      ]
    });
  });

  test("should return 401 when token is not provided", async () => {

    const response = await request(app)
      .get("/api/auth/get-me");

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Token not provided");
  });

  test("should return 401 when token is invalid", async () => {

    const response = await request(app)
      .get("/api/auth/get-me")
      .set("Cookie", "token=invalid-token");

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  test("should return user details with a valid token", async () => {

    const user = await userModel.create({
      username: "getmetest",
      email: "getmetest@example.com",
      password: "hashedpassword"
    });

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET
    );

    const response = await request(app)
      .get("/api/auth/get-me")
      .set("Cookie", `token=${token}`);

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.username).toBe("getmetest");
    expect(response.body.user.email).toBe("getmetest@example.com");

  });

  test("should return 401 when token is blacklisted", async () => {

    let token;

    const user = await userModel.create({
      username: "blacklisttest",
      email: "blacklisttest@example.com",
      password: "hashedpassword"
    });

    token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET
    );

    await tokenBlacklistModel.create({
      token: token
    });

    const response = await request(app)
      .get("/api/auth/get-me")
      .set("Cookie", `token=${token}`);

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Token is invalid");
    await tokenBlacklistModel.deleteOne({ token });
  });

  afterEach(async () => {
    await userModel.deleteMany({
      $or: [
        { username: "getmetest" },
        { email: "getmetest@example.com" },
        { username: "blacklisttest" },
        { email: "blacklisttest@example.com" }
      ]
    });
  });

});