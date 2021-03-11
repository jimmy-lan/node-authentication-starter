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

/**
 * Sign refresh and access tokens for `user`.
 * @param user User document referring to the subject.
 * @param noRefreshRecord If true, this sign token action will not be re-
 *   corded in Redis for rate-limiting purpose.
 * @return An array of strings where the first item is the refresh token,
 *   and the second item is the access token.
 */
export const signTokens = async (
  user: UserDocument | LeanDocument<UserDocument>,
  noRefreshRecord: boolean = false
) => {
  const tokenProcessor = new TokenProcessor("HS512");
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

  if (!noRefreshRecord) {
    try {
      await tokenRefreshRateLimiter.consume(userId, 1);
    } catch (error) {
      throw new RateLimitedError();
    }
  }

  return [refreshToken, accessToken];
};
