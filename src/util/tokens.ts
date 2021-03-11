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
 * @return An array of strings where the first item is the refresh token,
 *   and the second item is the access token.
 */
export const signTokens = (user: UserDocument | LeanDocument<UserDocument>) => {
  const tokenProcessor = new TokenProcessor("HS512");
  const refreshSecret = process.env.REFRESH_SECRET + user.clientSecret;
  const accessSecret = process.env.ACCESS_SECRET!;

  const refreshToken = tokenProcessor.issueToken<RefreshTokenPayload>(
    {
      sub: user._id || user.id,
      iat: new Date().getTime(),
    },
    refreshSecret,
    TokenType.refresh
  );
  const accessToken = tokenProcessor.issueToken<AccessTokenPayload>(
    {
      sub: { id: user._id || user.id },
      iat: new Date().getTime(),
      data: { role: user.role },
    },
    accessSecret,
    TokenType.access
  );

  return [refreshToken, accessToken];
};

export const getRefreshRecordKey = (userId: string) => {
  return `refresh-${userId}`;
};

export const setRefreshRecord = async (userId: string, time: Date) => {
  const recordKey = getRefreshRecordKey(userId);
  return await redisClient.setAsync(recordKey, String(time.getTime()));
};

export const getRefreshRecord = async (userId: string) => {
  const recordKey = getRefreshRecordKey(userId);
  return await redisClient.getAsync(recordKey);
};
