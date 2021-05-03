/*
 * Created by Jimmy Lan
 * Creation Date: 2021-05-02
 */

import { app } from "../../src/app";
import {
  connectMongo,
  setEnvVariables,
  tearDownMongo,
  apiLink,
} from "../common";

import mongoose from "mongoose";
import request from "supertest";
import { PasswordEncoder } from "../../src/services";
import { UserRole } from "../../src/types";
import { signTokens } from "../../src/util";

jest.mock("../../src/services/redisClient");
jest.mock("../../src/services/rateLimiters");

describe("current user api", () => {
  const sampleUser = {
    email: "user@thepolyteam.com",
    password: "password",
    clientSecret: PasswordEncoder.randomString(20),
    profile: {
      name: {
        first: "Admin",
        last: "User",
      },
    },
    role: UserRole.member,
    // Not in database
    accessToken: "", // to be updated in beforeAll
  };

  beforeAll(async () => {
    setEnvVariables();
    await connectMongo();

    // Setup sample user
    const { email, password, clientSecret, role, profile } = sampleUser;
    const sampleUserEntry = {
      email,
      password: await PasswordEncoder.toHash(password),
      clientSecret,
      role,
      profile,
    };

    // Insert to document
    const userCollection = mongoose.connection.collection("users");
    await userCollection.insertOne(sampleUserEntry, {});

    // Generate access token for sample user
    const userDocument = await userCollection.findOne({ email });
    // WARNING: Assume `signTokens` works correctly
    const [_, accessToken] = await signTokens(userDocument, false);
    sampleUser.accessToken = accessToken;
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await tearDownMongo();
  });

  it("responds with 401 if authorization header is not present.", async () => {
    const response = await request(app)
      .get(apiLink("/current"))
      .send()
      .expect(401);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();
  });

  it("responds with 401 if authorization header is invalid.", async () => {
    const response = await request(app)
      .get(apiLink("/current"))
      .set("Authorization", "bearer qjwe9rj21irm1u28eidjfaf2q")
      .send()
      .expect(401);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();
  });

  it("response with 200 and details about user if given valid inputs.", async () => {
    const response = await request(app)
      .get(apiLink("/current"))
      .set("Authorization", `bearer ${sampleUser.accessToken}`)
      .send()
      .expect(200);

    expect(response.body.success).toBeTruthy();
    expect(response.body.payload).toBeDefined();
    expect(response.body.payload.email).toBeDefined();
    expect(response.body.payload.email).toEqual(sampleUser.email);
  });
});
