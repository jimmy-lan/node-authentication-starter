/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 * Description: Token processing utility class.
 */

import jwt, { Algorithm, SignOptions, VerifyOptions } from "jsonwebtoken";
import { TokenPayload } from "../models/Token";
import { UnauthorizedError } from "../errors";

export class TokenProcessor<T extends TokenPayload> {
  constructor(public algorithm: Algorithm) {}

  issueToken(payload: T, secret: string, options?: SignOptions) {
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
