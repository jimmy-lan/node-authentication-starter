/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */
import { LeanDocument } from "mongoose";

import { UserDocument } from "../models";
import {
  TokenProcessor,
  tokenRefreshRateLimiter,
  TokenType,
} from "../services";
import { AccessTokenPayload, RefreshTokenPayload } from "../types";
import { RateLimitedError } from "../errors";
import { setRateLimitErrorHeaders } from "./rateLimit";
import { Response } from "express";
import { tokenConfig } from "../config";

/**
 * Sign refresh and access tokens for `user`.
 * @param user User document referring to the subject.
 * @param refreshRecord If false, this sign token action will not be re-
 *   corded in Redis for rate-limiting purpose.
 * @param res Response object to set rate limit error headers.
 * @return An array of strings where the first item is the refresh token,
 *   and the second item is the access token.
 */
export const signTokens = async (
  user: UserDocument | LeanDocument<UserDocument>,
  refreshRecord: boolean = true,
  res?: Response
) => {
  const algorithm = tokenConfig.algorithms.access;
  const tokenProcessor = new TokenProcessor(algorithm);
  const refreshSecret = process.env.REFRESH_SECRET + user.clientSecret;
  const accessSecret = process.env.ACCESS_SECRET!;
  const userId = user._id || user.id;

  const refreshToken = tokenProcessor.issueToken<RefreshTokenPayload>(
    {
      sub: userId,
      iat: new Date().getTime(),
    },
    refreshSecret,
    TokenType.refresh
  );
  const accessToken = tokenProcessor.issueToken<AccessTokenPayload>(
    {
      sub: { id: userId },
      iat: new Date().getTime(),
      data: { role: user.role },
    },
    accessSecret,
    TokenType.access
  );

  if (refreshRecord) {
    try {
      await tokenRefreshRateLimiter.consume(userId, 1);
    } catch (rateLimiterRes) {
      // Update 2021-03-12: Make sure the result is usable.
      // Throw internal server error if consume function results in an exception.
      if (rateLimiterRes instanceof Error) {
        throw rateLimiterRes;
      }

      // Rate limit achieved.
      if (res) {
        setRateLimitErrorHeaders(res, rateLimiterRes);
      }
      throw new RateLimitedError();
    }
  }

  return [refreshToken, accessToken];
};
