/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */
import { BurstyRateLimiter, RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "./redisClient";
import { rateLimitConfig } from "../config";

/* ************************************************
 * * Refresh token and sign in use rate limiter
 ************************************************ */

export const tokenRefreshRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "refresh",
  points: rateLimitConfig.tokenRefresh.normal.points,
  duration: rateLimitConfig.tokenRefresh.normal.duration,
});

/* ************************************************
 * * Requests made by users rate limiter
 ************************************************ */

// Users can perform at most 15 requests per 30 seconds
const userRequestRateLimiterNormal = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "user_request",
  points: rateLimitConfig.userRequest.normal.points,
  duration: rateLimitConfig.userRequest.normal.duration,
});

// In a 5-minute interval, users can burst 10 requests
const userRequestRateLimiterBurst = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "user_request_burst",
  points: rateLimitConfig.userRequest.burst.points,
  duration: rateLimitConfig.userRequest.burst.duration,
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
  points: rateLimitConfig.ip.normal.points,
  duration: rateLimitConfig.ip.normal.duration,
});

const ipRateLimiterBurst = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ip_burst",
  points: rateLimitConfig.ip.burst.points,
  duration: rateLimitConfig.ip.burst.duration,
});

export const ipRateLimiter = new BurstyRateLimiter(
  ipRateLimiterNormal,
  ipRateLimiterBurst
);

/* ************************************************
 * * Sign in attempts rate limiter
 * * Password reset attempts rate limiter
 * ************************************************
 * * The following rate limiters are based on
 * * IP + email pair. They should be used as
 * * complements of `authBruteIPRateLimiter`.
 ************************************************ */

// See authBruteIPRateLimiter for more explanation.
// We use different email + IP pair rate limiters for the
// sign in and password reset features to avoid conflict.

export const signInRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "auth_brute_ip_and_email",
  points: rateLimitConfig.signIn.normal.points,
  duration: rateLimitConfig.signIn.normal.duration,
  blockDuration: rateLimitConfig.signIn.normal.blockDuration,
});

export const passwordResetRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "password_reset",
  points: rateLimitConfig.passwordReset.normal.points,
  duration: rateLimitConfig.passwordReset.normal.duration,
  blockDuration: rateLimitConfig.passwordReset.normal.blockDuration,
});

/* ************************************************
 * * Authentication brute force prevention limiter
 ************************************************ */

/**
 * This rate limiter is based purely on the IP address.
 * Generally, we use two rate limiters to prevent password
 * or reset-password brute force:
 * - (1) Pure IP rate limiter which bans the IP after X attempts;
 * - (2) IP and email address limiter which bans the IP and email
 *       pair after Y attempts.
 * - For some Y < X.
 * If we only use user's email to rate limit, a malicious hacker
 * can program a bot to send just enough requests to rate limit
 * the email for every interval.
 * The true user's account will then always be locked, which is
 * a serious vulnerability.
 * By taking the IP address in to account, the above problem is
 * resolved. However, a malicious hacker can always have a bot
 * network to issue requests from different IP addresses, but our
 * approach will simply increase the cost for them.
 */
export const authBruteIPRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "auth_brute_ip",
  points: rateLimitConfig.authBruteForceIP.normal.points,
  duration: rateLimitConfig.authBruteForceIP.normal.duration,
});
