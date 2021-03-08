/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 * Description: Token processing utility class.
 */

import jwt, { Algorithm, SignOptions, VerifyOptions } from "jsonwebtoken";
import { UnauthorizedError } from "../errors";

export enum TokenType {
  bearer = "bearer",
  refresh = "refresh",
  reset = "reset",
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp?: number;
  data?: Object;
}

export class TokenProcessor<T extends TokenPayload> {
  constructor(public algorithm: Algorithm) {}

  issueToken(
    payload: T,
    secret: string,
    tokenType: TokenType,
    options?: SignOptions
  ) {
    if (tokenType === TokenType.refresh) {
      // Set 5 minute expiration time for refresh tokens
      payload.exp = payload.iat + 5 * 60 * 1000;
    } else if (tokenType === TokenType.reset) {
      // Set 10 minute expiration time for password reset
      payload.exp = payload.iat + 10 * 60 * 1000;
    }

    return jwt.sign(payload, secret, { algorithm: this.algorithm, ...options });
  }

  decodeToken(token: string) {
    let decoded;
    try {
      decoded = jwt.decode(token, { json: true });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedError("Invalid token.");
    }
    return decoded;
  }

  verifyToken(token: string, secret: string, options?: VerifyOptions) {
    let payload;
    try {
      payload = jwt.verify(token, secret, {
        algorithms: [this.algorithm],
        clockTolerance: 1,
        ...options,
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedError("Invalid token");
    }
    return payload;
  }
}
