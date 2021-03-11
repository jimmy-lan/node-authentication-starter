/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */

import { createClient } from "redis";

const redisConnection = process.env.REDIS_URI!;
const redisClient = createClient(redisConnection);

redisClient.on("error", (error) => {
  console.log(error);
});

export { redisClient };
