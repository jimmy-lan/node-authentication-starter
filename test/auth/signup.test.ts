/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-16
 */

import request from "supertest";
import mongoose from "mongoose";

import {
  apiLink,
  clearDatabase,
  connectMongo,
  setEnvVariables,
  tearDownMongo,
} from "../common";
import { app } from "../../src/app";
import { PasswordEncoder } from "../../src/services";

jest.mock("../../src/services/redisClient");
jest.mock("../../src/services/rateLimiters");

describe("sign up api", () => {
  beforeAll(async () => {
    await connectMongo();
    setEnvVariables();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await tearDownMongo();
    jest.clearAllMocks();
  });

  it("responds with 400 when the request contains invalid fields.", async () => {
    let response;

    response = await request(app).post(apiLink("/signup")).send({}).expect(400);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();

    // Lacking first and last name
    response = await request(app)
      .post(apiLink("/signup"))
      .send({ email: "a@b.com", password: "weoqrle" })
      .expect(400);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();

    // Lacking password
    response = await request(app)
      .post(apiLink("/signup"))
      .send({ email: "a@b.com", firstName: "Jimmy", lastName: "Lan" })
      .expect(400);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();
  });

  it("responds with 400 when user already exists.", async () => {
    const email = "user@thepolyteam.com";

    const userCollection = mongoose.connection.collection("users");
    await userCollection.insertOne(
      { email },
      { bypassDocumentValidation: true }
    );

    const response = await request(app)
      .post(apiLink("/signup"))
      .send({
        email,
        password: "password",
        firstName: "Jimmy",
        lastName: "Lan",
      })
      .expect(400);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();
  });

  it("signs user up when valid information is provided.", async () => {
    const email = "user@thepolyteam.com";
    const password = "password";
    const firstName = "Jimmy";
    const lastName = "Lan";

    const response = await request(app)
      .post(apiLink("/signup"))
      .send({
        email,
        password,
        firstName,
        lastName,
      })
      .expect(201);

    expect(response.body.success).toBeTruthy();
    expect(response.body.payload.accessToken).toBeDefined();
    expect(response.body.payload.accessToken.split(".")).toHaveLength(3);
    expect(response.body.payload.refreshToken).toBeDefined();
    expect(response.body.payload.refreshToken.split(".")).toHaveLength(3);

    const createdUser = await mongoose.connection
      .collection("users")
      .findOne({ email });
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toEqual(email);
    expect(
      PasswordEncoder.compare(password, createdUser.password)
    ).toBeTruthy();
    expect(createdUser.profile.name.first).toEqual(firstName);
    expect(createdUser.profile.name.last).toEqual(lastName);
  });
});
