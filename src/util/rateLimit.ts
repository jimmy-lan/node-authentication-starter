/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */

import { Response } from "express";
import { IRateLimiterRes } from "rate-limiter-flexible";

/**
 * Extract information from a RateLimiterRes object
 * and set the appropriate response headers.
 * Please only call this function when the rate limit
 * is exceeding (i.e., an error is thrown by the limiter).
 * @param res Response instance provided by express
 * @param rateLimiterRes Rate limiter result
 */
export const setRateLimitErrorHeaders = (
  res: Response,
  rateLimiterRes: IRateLimiterRes
) => {
  if (!rateLimiterRes.msBeforeNext) {
    console.warn(
      "Could not find attribute `msBeforeNext` from rate limiter response."
    );
    console.warn(
      "You should only call setRateLimitErrorHeaders when the rate limiter response with error " +
        "(i.e. rate limit exceeded)."
    );
    rateLimiterRes.msBeforeNext = 1000;
  }

  const retryAfter = rateLimiterRes.msBeforeNext / 1000;
  const rateLimitReset = new Date(Date.now() + retryAfter).getTime();
  res.set("Access-Control-Expose-Headers", "Retry-After, X-RateLimit-Reset");
  res.setHeader("Retry-After", retryAfter);
  res.setHeader("X-RateLimit-Reset", rateLimitReset);
};
