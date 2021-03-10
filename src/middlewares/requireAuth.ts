/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-10
 * Description:
 *   Middleware which expose route to authenticated users only.
 */

import { Request, Response, NextFunction } from "express";
import { AccessTokenPayload, RefreshTokenPayload, ResPayload } from "../types";
import { TokenProcessor } from "../services";
import { UnauthorizedError } from "../errors";
import { signTokens } from "../routes/auth/helpers";
import { User } from "../models";

/**
 * Extract token string from request header.
 * @param req The request to parse.
 * @param headerField A field in request header, holding a string, to extract token from.
 * @param prefix The prefix that must be present in the header field.
 * @return A not-empty string containing the extracted token if successful.
 *    Empty string if failed.
 */
const extractTokenFromHeader = (
  req: Request,
  headerField: string,
  prefix?: string
) => {
  // Extract raw
  const raw = req.headers[headerField];
  if (!raw || typeof raw !== "string") {
    return "";
  }

  // Check prefix
  if (prefix && raw.slice(0, prefix.length) !== prefix) {
    return "";
  }
  return raw.slice(prefix?.length).trim();
};

// Override Express declaration to include currentUser property
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload["sub"] & AccessTokenPayload["data"];
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response<ResPayload>,
  next: NextFunction
) => {
  const accessToken = extractTokenFromHeader(req, "authorization", "bearer");
  if (!accessToken) {
    throw new UnauthorizedError();
  }

  const tokenProcessor = new TokenProcessor("RS512");
  try {
    const accessSecret = process.env.ACCESS_SECRET!;
    const { sub, data } = tokenProcessor.verifyToken<AccessTokenPayload>(
      accessToken,
      accessSecret
    );
    req.user = { ...sub, ...data };
  } catch (error) {
    // Try refresh token
    const refreshToken = extractTokenFromHeader(
      req,
      "x-refresh-token",
      "refresh"
    );

    const claims = tokenProcessor.decodeToken(refreshToken);
    if (!claims?.sub) {
      throw new UnauthorizedError();
    }
    const userId = claims.sub;

    // Get user information
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedError();
    }

    // Verify refresh token
    const clientSecret = user.clientSecret;
    const refreshSecret = process.env.REFRESH_SECRET! + clientSecret;
    tokenProcessor.verifyToken<RefreshTokenPayload>(
      refreshToken,
      refreshSecret
    );

    // Assign new tokens
    const [newRefreshToken, newAccessToken] = signTokens(user);
    res.set("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
    res.set("x-access-token", newAccessToken);
    res.set("x-refresh-token", newRefreshToken);
    req.user = { id: user._id || user.id, role: user.role };
  }

  return next();
};
