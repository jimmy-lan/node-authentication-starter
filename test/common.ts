/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-16
 * Description:
 *     I used to have a file named `setupTests.ts` here which will be run before
 *   all test cases. However, Jest and Typescript does not seem to cooperate very
 *   well at the time when this project was bootstrapped, so I had to make the decision
 *   of removing that file and extract common helper functions instead.
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const setEnvVariables = () => {
  process.env.ACCESS_SECRET = "asdf";
  process.env.REFRESH_SECRET = "asdf";
  process.env.RESET_SECRET = "asdf";
  // Stop NODE from complaining about self-signed certificates
  // during test.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  process.env.NODE_ENV = "testing";
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

export const tearDownMongo = async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

  await mongo.stop();
  await mongoose.connection.close();
};
