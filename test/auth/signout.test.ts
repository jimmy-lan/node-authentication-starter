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
import { UserDocument } from "../../src/models";

jest.mock("../../src/services/redisClient");
jest.mock("../../src/services/rateLimiters");

describe("sign out api", () => {
  const initClientSecret = PasswordEncoder.randomString(20);
  const sampleUser = {
    id: "", // to be updated in beforeAll
    email: "user@thepolyteam.com",
    password: "password",
    clientSecret: initClientSecret,
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

  let initialUserDocument: UserDocument; // to be updated in beforeAll

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
    initialUserDocument = await userCollection.findOne({ email });
    // WARNING: Assume `signTokens` works correctly
    const [_, accessToken] = await signTokens(initialUserDocument, false);
    sampleUser.accessToken = accessToken;
    sampleUser.id = initialUserDocument._id || initialUserDocument.id;
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await tearDownMongo();
  });

  it("responds with 401 unauthorized if an invalid authorization token is provided.", async () => {
    const response = await request(app)
      .post(apiLink("/signout"))
      .set("Authorization", "bearer jqir2u1302iu3r912mdwjeqi0xjmx123u")
      .send()
      .expect(401);

    // Verify return value
    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();

    // Verify clientSecret has not been changed in the database
    const userCollection = mongoose.connection.collection("users");
    const userDocument = await userCollection.findOne({
      email: sampleUser.email,
    });
    expect(sampleUser.clientSecret).toEqual(userDocument.clientSecret);
  });

  it("responds with 200 and updates client secret when user signs out.", async () => {
    const response = await request(app)
      .post(apiLink("/signout"))
      .set("Authorization", `bearer ${sampleUser.accessToken}`)
      .send()
      .expect(200);

    // Verify return value
    expect(response.body.success).toBeTruthy();
    expect(response.body.payload).toBeDefined();
    expect(String(response.body.payload.id)).toEqual(
      String(initialUserDocument._id)
    );
    expect(response.body.payload.email).toEqual(sampleUser.email);

    // Verify clientSecret has been changed in the database
    const userCollection = mongoose.connection.collection("users");
    const updatedUser = await userCollection.findOne({
      email: sampleUser.email,
    });
    expect(updatedUser.clientSecret).not.toEqual(initClientSecret);
  });
});
