/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-15
 */

import { createClient } from "redis-mock";
import { RedisClient } from "redis";

interface OwnRedisClient extends RedisClient {
  getAsync: (arg1: string) => Promise<string | null>;
  setAsync: Function;
}

const client = createClient() as OwnRedisClient;

client.on("error", () => {});

export { client as redisClient };
