const request = require("supertest");
const bcrypt = require("bcryptjs");
const userModel = require("../../src/models/user.model");

jest.mock("../../src/services/ai.service.js", () => ({}));

const app = require("../../src/app");

describe("POST /api/auth/login", () => {

  beforeEach(async () => {
    await userModel.deleteMany({
      $or: [
        { username: "logintest" },
        { email: "logintest@example.com" },
        { email: "wrongpassword@example.com" }
      ]
    });
  });

  test("should login an existing user with correct credentials", async () => {

    const hashedPassword = await bcrypt.hash("Password123", 10);

    await userModel.create({
      username: "logintest",
      email: "logintest@example.com",
      password: hashedPassword
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "logintest@example.com",
        password: "Password123"
      });

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe("logintest@example.com");
  });

  test("should return 400 when password is incorrect", async () => {

    const hashedPassword = await bcrypt.hash("Password123", 10);

    await userModel.create({
      username: "logintest",
      email: "wrongpassword@example.com",
      password: hashedPassword
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrongpassword@example.com",
        password: "WrongPassword"
      });

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid password");
  });

  test("should return 400 when user does not exist", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "doesnotexist@example.com",
        password: "Password123"
      });

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User not found");
  });

  test("should return 400 when login fields are missing", async () => {

  const response = await request(app)
    .post("/api/auth/login")
    .send({});

  console.log("Status:", response.statusCode);
  console.log("Body:", response.body);

  expect(response.statusCode).toBe(400);
  expect(response.body.message)
    .toBe("Please provide email and password");
});

  afterEach(async () => {
    await userModel.deleteMany({
      $or: [
        { username: "logintest" },
        { email: "logintest@example.com" },
        { email: "wrongpassword@example.com" }
      ]
    });
  });

});