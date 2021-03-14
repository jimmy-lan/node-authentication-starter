/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-14
 * Description:
 *    This configuration file is created because we might need to refer to the rate limiter
 *    values at more than one place in our codebase. For example, people may find it helpful
 *    to use `rateLimiter.get` to check for the current rate limit consumption before calling
 *    `rateLimiter.consume`, which may throw an error if the user is about to achieve the rate
 *    limit.
 */

/*
 * IMPORTANT: To understand why we need some of the configuration fields in this file, please refer
 * to the comments written in `src/services/rateLimiters.ts`.
 */

/**
 * General configuration object for rate limiters.
 * Properties:
 * - points: A number representing the number of requests that the user can send
 *   to server for a particular resource.
 * - duration: Amount of time, in **seconds**, for the `points` property to reset.
 * - blockDuration: Amount of time to block a request after the points are used up.
 *   This property only presents in some fields.
 * For each rate limiter, there may be `normal` and `burst` settings.
 * The normal setting specifies how the rate limiter behaves under normal conditions.
 * The burst setting allows additional usage burst over a slightly longer period of time.
 */
export const rateLimitConfig = {
  tokenRefresh: {
    normal: {
      points: 3,
      duration: 5 * 60,
    },
  },
  userRequest: {
    normal: {
      points: 15,
      duration: 30,
    },
    burst: {
      points: 10,
      duration: 5 * 60,
    },
  },
  ip: {
    normal: {
      points: 20,
      duration: 35,
    },
    burst: {
      points: 10,
      duration: 3 * 60,
    },
  },
  signIn: {
    normal: {
      points: 6,
      duration: 30 * 24 * 60 * 60, // Store failed records for 1  month
      blockDuration: 2 * 60 * 60, // Block for 2 hours after 6 failed attempts
    },
  },
  passwordReset: {
    normal: {
      points: 1,
      duration: 2 * 60,
      blockDuration: 2 * 60, // This attribute helps determine msBeforeNext
    },
  },
  authBruteForceIP: {
    normal: {
      points: 30,
      duration: 24 * 60 * 60,
    },
  },
};
