/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-17
 */

import { PasswordEncoder } from "../../src/services";
import { UserRole } from "../../src/types";
import {
  apiLink,
  connectMongo,
  setEnvVariables,
  tearDownMongo,
} from "../common";
import mongoose from "mongoose";
import { app } from "../../src/app";
import request from "supertest";
import { TemplateEmailSender } from "../../src/services/EmailSender";

jest.mock("../../src/services/redisClient");
jest.mock("../../src/services/rateLimiters");
jest.mock("../../src/services/EmailSender");

describe("reset-password request api", () => {
  const sampleUser = {
    email: "user@thepolyteam.com",
    password: "password",
    clientSecret: PasswordEncoder.randomString(20),
    role: UserRole.member,
    profile: {
      name: {
        first: "User",
        last: "Name",
      },
    },
  };

  beforeAll(async () => {
    setEnvVariables();
    await connectMongo();

    // Required by Jest
    TemplateEmailSender.prototype.setDynamicTemplateData = jest
      .fn()
      .mockReturnThis();
    TemplateEmailSender.prototype.setRecipient = jest.fn().mockReturnThis();
    TemplateEmailSender.prototype.setTemplateId = jest.fn().mockReturnThis();
    TemplateEmailSender.prototype.setFrom = jest.fn().mockReturnThis();

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
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await tearDownMongo();
  });

  it("responds with 400 when the request contains invalid fields.", async () => {
    let response;

    response = await request(app)
      .post(apiLink("/reset-password"))
      .send({})
      .expect(400);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();

    response = await request(app)
      .post(apiLink("/reset-password"))
      .send({ email: "ajfkaldfj@" })
      .expect(400);

    expect(response.body.success).toBeDefined();
    expect(response.body.success).toBeFalsy();
  });

  it("responds with 200 even if the user does not exist in the database.", async () => {
    const response = await request(app)
      .post(apiLink("/reset-password"))
      .send({ email: "a@b.com" })
      .expect(200);

    expect(response.body.success).toBeTruthy();

    // Email should not be sent if email is not found.
    expect(TemplateEmailSender.prototype.send).not.toHaveBeenCalled();
  });

  it("responds with 200 and sends password reset email on valid request.", async () => {
    const response = await request(app)
      .post(apiLink("/reset-password"))
      .send({ email: sampleUser.email })
      .expect(200);

    expect(response.body.success).toBeTruthy();

    expect(TemplateEmailSender.prototype.send).toHaveBeenCalledTimes(1);
  });
});
