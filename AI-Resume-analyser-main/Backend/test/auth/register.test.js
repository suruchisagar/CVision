const request = require("supertest");
const userModel = require("../../src/models/user.model");

jest.mock("../../src/services/ai.service.js", () => ({}));

const app = require("../../src/app");

describe("POST /api/auth/register", () => {

  beforeEach(async () => {
  await userModel.deleteMany({
    $or: [
      { email: "jestuser1@example.com" },
      { username: "jestuser1" }
    ]
  });
});

  test("should register a new user", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "jestuser1",
        email: "jestuser1@example.com",
        password: "Password123"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.username).toBe("jestuser1");
    expect(response.body.user.email).toBe("jestuser1@example.com");
  });

  test("should return 400 when required fields are missing", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "jestuser"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message)
      .toBe("Please provide username, email and password");
  });

  test("should return 400 when email already exists", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        username: "jestuser1",
        email: "duplicate@example.com",
        password: "Password123"
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "jestuser2",
        email: "duplicate@example.com",
        password: "Password123"
      });

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  test("should return 400 when username already exists", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateuser",
        email: "user1@example.com",
        password: "Password123"
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "duplicateuser",
        email: "user2@example.com",
        password: "Password123"
      });

    console.log("Status:", response.statusCode);
    console.log("Body:", response.body);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  afterEach(async () => {
  await userModel.deleteMany({
    $or: [
      { email: "jestuser1@example.com" },
      { username: "jestuser1" }
    ]
  });
});

});