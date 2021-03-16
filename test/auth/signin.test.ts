/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-15
 */

import request from "supertest";

import { app } from "../../src/app";

const apiLink = (uri: string) => `/api/v1/users${uri}`;

jest.mock("../../src/services/redisClient");
jest.mock("../../src/services/rateLimiters");

it("responds with 400 when the request contains invalid fields.", async () => {
  const response = await request(app)
    .post(apiLink("/signin"))
    .send({})
    .expect(400);
});
