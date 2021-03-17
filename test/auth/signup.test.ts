/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-16
 */

import {
  apiLink,
  connectMongo,
  setEnvVariables,
  tearDownMongo,
} from "../common";
import request from "supertest";
import { app } from "../../src/app";

jest.mock("../../src/services/redisClient");
jest.mock("../../src/services/rateLimiters");

describe("sign up api", () => {
  beforeAll(async () => {
    await connectMongo();
    setEnvVariables();
  });

  afterAll(async () => {
    await tearDownMongo();
    jest.clearAllMocks();
  });

  it("responds with 400 when the request contains invalid fields", async () => {
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
});
