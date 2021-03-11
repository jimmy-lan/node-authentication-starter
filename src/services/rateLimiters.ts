/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "./redisClient";

export const tokenRefreshRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "refresh",
  points: 3, // 3 token refresh requests
  duration: 5 * 60, // 5 minutes by user
});
