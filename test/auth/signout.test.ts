/*
 * Created by Jimmy Lan
 * Creation Date: 2021-05-10
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

describe("sign out api", () => {
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

  it("should update client secret when user signs out", () => {});
});
