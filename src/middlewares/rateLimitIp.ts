/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 * Description: Middleware to apply rate limiter on ip address.
 */

import { Request, Response, NextFunction } from "express";
import { ipRateLimiter } from "../services";
import { setRateLimitErrorHeaders } from "../util";
import { RateLimitedError } from "../errors";

export const rateLimitIp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;

  try {
    await ipRateLimiter.consume(ip);
  } catch (rateLimiterRes) {
    setRateLimitErrorHeaders(res, rateLimiterRes);
    throw new RateLimitedError();
  }

  next();
};
