/*
 * Created by Jimmy Lan
 * Creation Date: 2020-12-01
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  // Env variables
  process.env.ACCESS_SECRET = "asdf";
  process.env.REFRESH_SECRET = "asdf";
  process.env.RESET_SECRET = "asdf";
  // Stop NODE from complaining about self-signed certificates
  // during test.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  process.env.NODE_ENV = "testing";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  // @ts-ignore
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
