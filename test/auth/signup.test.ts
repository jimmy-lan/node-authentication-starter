/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-16
 */

import { connectMongo, setEnvVariables, tearDownMongo } from "../common";

describe("sign up api", () => {
  beforeAll(async () => {
    await connectMongo();
    setEnvVariables();
  });

  afterAll(async () => {
    await tearDownMongo();
    jest.clearAllMocks();
  });
});
