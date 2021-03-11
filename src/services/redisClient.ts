/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */

import { createClient, RedisClient } from "redis";
import { promisify } from "util";

interface OwnRedisClient extends RedisClient {
  getAsync: (arg1: string) => Promise<string | null>;
  setAsync: Function;
}

const redisConnection = process.env.REDIS_URI!;
const redisClient = createClient(redisConnection) as OwnRedisClient;

redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.setAsync = promisify(redisClient.set).bind(redisClient);

redisClient.on("ready", () => {
  console.log("Connected to Redis.");
});

redisClient.on("error", (error) => {
  console.log(error);
});

export { redisClient };