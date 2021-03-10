/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { UserDocument } from "../../models";
import { TokenProcessor, TokenType } from "../../services";
import { AccessTokenPayload, RefreshTokenPayload } from "../../types";

/**
 * Sign refresh and access tokens for `user`.
 * @param user User document referring to the subject.
 * @return An array of strings where the first item is the refresh token,
 *   and the second item is the access token.
 */
export const signTokens = (user: UserDocument) => {
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
