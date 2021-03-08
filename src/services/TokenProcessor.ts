/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 * Description: Token processing utility class.
 */

import jwt from "jsonwebtoken";

import { UserDocument, UserModel } from "../schemas";
import { UnauthorizedError } from "../errors";

export class TokenProcessor {
  static issueToken(user: UserDocument) {}

  static async getBearer(
    refreshToken: string,
    User: UserModel,
    refreshSecret: string,
    bearerSecret: string
  ) {
    let userId;
    try {
      const claims = jwt.decode(refreshToken, { json: true });
      userId = claims?.sub;
    } catch (error) {
      throw new UnauthorizedError("Invalid token.");
    }

    if (!userId) {
      throw new UnauthorizedError("Invalid token.");
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new UnauthorizedError("Invalid token.");
    }

    const secret = refreshSecret + user.clientSecret;

    try {
      jwt.verify(refreshToken, secret);
    } catch (error) {
      throw new UnauthorizedError("Invalid token.");
    }

    // Create new token

    // Return bearer token
  }
}
