/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { UserDocument } from "../../schemas";
import { TokenProcessor, TokenType } from "../../services";
import { AuthTokenPayload } from "../../models";

/**
 * Sign refresh and bearer tokens for `user`.
 * @param user User document referring to the subject.
 * @return An array of strings where the first item is the refresh token,
 *   and the second item is the bearer token.
 */
export const signTokens = (user: UserDocument) => {
  const tokenProcessor = new TokenProcessor("HS512");
  const refreshSecret = process.env.REFRESH_SECRET + user.clientSecret;
  const bearerSecret = process.env.BEARER_SECRET!;

  const refreshToken = tokenProcessor.issueToken(
    {
      sub: user._id || user.id,
      iat: new Date().getTime(),
    },
    refreshSecret,
    TokenType.refresh
  );
  const bearerToken = tokenProcessor.issueToken<AuthTokenPayload>(
    {
      sub: user._id || user.id,
      iat: new Date().getTime(),
      data: { role: user.role },
    },
    bearerSecret,
    TokenType.bearer
  );
  return [refreshToken, bearerToken];
};
