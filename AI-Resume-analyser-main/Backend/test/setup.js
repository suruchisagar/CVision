jest.setTimeout(15000);
require("dotenv").config();

const mongoose = require("mongoose");
const connectToDB = require("../src/config/database");

beforeAll(async () => {
  await connectToDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});