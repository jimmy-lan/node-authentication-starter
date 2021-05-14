/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 * Description: Token processing utility class.
 */

import jwt, { Algorithm, SignOptions, VerifyOptions } from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import { tokenConfig } from "../config";

export enum TokenType {
  access = "access",
  refresh = "refresh",
  reset = "reset",
}

export interface TokenPayload {
  sub: string | Record<string, unknown>;
  iat?: number;
  exp?: number;
  data?: Record<string, unknown>;
}

export class TokenProcessor {
  constructor(public algorithm: Algorithm) {}

  issueToken<T extends TokenPayload>(
    payload: T,
    secret: string,
    tokenType: TokenType,
    options?: SignOptions
  ) {
    if (!payload.iat) {
      payload.iat = new Date().getTime();
    }

    if (!payload.exp) {
      switch (tokenType) {
        case TokenType.access:
          // Set 5 minute expiration time for access tokens
          payload.exp = payload.iat + tokenConfig.defaultExpirations.access;
          // payload.exp = payload.iat + 5 * 60 * 1000;
          break;
        case TokenType.reset:
          // Set 10 minute expiration time for password reset
          payload.exp = payload.iat + tokenConfig.defaultExpirations.reset;
          break;
        case TokenType.refresh:
          // Set 7 day expiration time for refresh tokens
          payload.exp = payload.iat + tokenConfig.defaultExpirations.refresh;
          break;
      }
    }

    return jwt.sign(payload, secret, {
      algorithm: this.algorithm,
      ...options,
    });
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

  verifyToken<T extends TokenPayload>(
    token: string,
    secret: string,
    options?: VerifyOptions
  ) {
    let payload: T;
    const clockTolerance = 1;
    try {
      payload = jwt.verify(token, secret, {
        algorithms: [this.algorithm],
        clockTolerance,
        ...options,
      }) as T;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedError("Invalid token");
    }

    // Manual check for JSON expiration
    // Added because jwt.verify seem to have a bug in checking token expiration
    if (payload.exp) {
      const expireDate = new Date(payload.exp);
      const currentTime = new Date().getTime() - clockTolerance * 1000;
      if (expireDate < new Date(currentTime)) {
        // Token expired
        throw new UnauthorizedError("Token expired");
      }
    }

    return payload;
  }
}
