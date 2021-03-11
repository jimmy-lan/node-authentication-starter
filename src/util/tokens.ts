/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */
import { LeanDocument } from "mongoose";

import { UserDocument } from "../models";
import { redisClient, TokenProcessor, TokenType } from "../services";
import { AccessTokenPayload, RefreshTokenPayload } from "../types";

/**
 * Sign refresh and access tokens for `user`.
 * @param user User document referring to the subject.
 * @param noRefreshRecord If true, this sign token action will not be re-
 *   corded in Redis.
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
    await setRefreshRecord(userId, new Date(), 3 * 60 * 1000);
  }

  return [refreshToken, accessToken];
};

export const getRefreshRecordKey = (userId: string) => {
  return `refresh-${userId}`;
};

/**
 * Set token refresh record for user with `userId`.
 * @param userId Id of user.
 * @param time Time when the refresh token is assigned.
 * @param freezePeriod freezePeriod Duration of the freezing period measured in milliseconds.
 *   A freezing period is the time period at which a user cannot request for
 *   additional access tokens after an original request for a token.
 */
export const setRefreshRecord = async (
  userId: string,
  time: Date,
  freezePeriod: number
) => {
  const recordKey = getRefreshRecordKey(userId);
  return await redisClient.setAsync(
    recordKey,
    String(time.getTime()),
    "PX",
    freezePeriod
  );
};

export const getRefreshRecord = async (userId: string) => {
  const recordKey = getRefreshRecordKey(userId);
  return await redisClient.getAsync(recordKey);
};

/**
 * Given a valid refresh token, determine whether the user is exceeding
 * the rate limit of obtaining access tokens.
 * If this value is true, we should not assign new tokens for this user.
 * @param userId Id of user.
 * @param currTime Current timestamp.
 * @param freezePeriod Duration of the freezing period measured in milliseconds.
 *   A freezing period is the time period at which a user cannot request for
 *   additional access tokens after an original request for a token.
 */
export const isExceedTokenRateLimit = async (
  userId: string,
  currTime: Date,
  freezePeriod: number
) => {
  const refreshRecord = await getRefreshRecord(userId);
  if (!refreshRecord) {
    return false;
  }

  // Still check for the record value despite the ttl settings,
  // just in case a Redis failure prevented record removal.
  const lastRefreshed = new Date(Number(refreshRecord));
  return new Date(currTime.getTime() - freezePeriod) < lastRefreshed;
};
