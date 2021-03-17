/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-16
 * Description:
 *     I used to put many of the logic defined in this file in `setupTests.ts`.
 *   However, Jest and Typescript does not seem to cooperate very well at the time
 *   when this project was bootstrapped, so I had to make the decision of removing
 *   that file and extract common helper functions instead.
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const apiLink = (uri: string) => `/api/v1/users${uri}`;

export const setEnvVariables = () => {
  process.env.ACCESS_SECRET = "asdf";
  process.env.REFRESH_SECRET = "asdf";
  process.env.RESET_SECRET = "asdf";
  // Stop NODE from complaining about self-signed certificates
  // during test.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  process.env.NODE_ENV = "test";
};

let mongo: MongoMemoryServer;

export const connectMongo = async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

export const clearDatabase = async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
};

export const tearDownMongo = async () => {
  await clearDatabase();

  await mongo.stop();
  await mongoose.connection.close();
};
