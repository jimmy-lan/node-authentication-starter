/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */
import { BurstyRateLimiter, RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "./redisClient";

/* ************************************************
 * * Refresh token and sign in use rate limiter
 ************************************************ */

export const tokenRefreshRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "refresh",
  points: 3, // 3 token refresh requests
  duration: 5 * 60, // 5 minutes by user
});

/* ************************************************
 * * Requests made by users rate limiter
 ************************************************ */

// Users can perform at most 15 requests per 30 seconds
const userRequestRateLimiterNormal = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "user_request",
  points: 15,
  duration: 30,
});

// In a 5-minute interval, users can burst 10 requests
const userRequestRateLimiterBurst = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "user_request_burst",
  points: 10,
  duration: 5 * 60,
});

export const userRequestRateLimiter = new BurstyRateLimiter(
  userRequestRateLimiterNormal,
  userRequestRateLimiterBurst
);

/* ************************************************
 * * Rate limit based on IP addresses
 ************************************************ */

const ipRateLimiterNormal = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ip",
  points: 20,
  duration: 35,
});

const ipRateLimiterBurst = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ip_burst",
  points: 10,
  duration: 3 * 60,
});

export const ipRateLimiter = new BurstyRateLimiter(
  ipRateLimiterNormal,
  ipRateLimiterBurst
);

/* ************************************************
 * * Password reset attempts rate limiter
 ************************************************ */

/**
 * This rate limiter is used for ip + email pair.
 * This rate limiter should be used as a complement of the
 * `authBruteIPRateLimiter`.
 */
export const passwordResetRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "password_reset",
  points: 1,
  duration: 2 * 60,
});

/* ************************************************
 * * Authentication brute force prevention limiter
 ************************************************ */

/**
 * This rate limiter is based purely on the ip address.
 */
export const authBruteIPRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "auth_brute_ip",
  points: 30,
  duration: 24 * 60 * 60,
});

export const authBruteEmailAndIPRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "auth_brute_ip_and_email",
  points: 6,
  duration: 30 * 24 * 60 * 60, // Store failed records for 1 month
  blockDuration: 2 * 60 * 60, // Block for 2 hours after 6 failed attempts
});
