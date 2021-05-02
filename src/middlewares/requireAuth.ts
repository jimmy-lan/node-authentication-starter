/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-10
 * Description:
 *   Middleware which expose route to authenticated users only.
 */

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { AccessTokenPayload, RefreshTokenPayload, ResBody } from "../types";
import { TokenProcessor, userRequestRateLimiter } from "../services";
import { RateLimitedError, UnauthorizedError } from "../errors";
import { User } from "../models";
import { setRateLimitErrorHeaders, signTokens } from "../util";
import { tokenConfig } from "../config";

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
  const raw = req.headers[headerField.toLowerCase()];
  if (!raw || typeof raw !== "string") {
    return "";
  }

  // Check prefix
  if (
    prefix &&
    raw.slice(0, prefix.length).toLowerCase() !== prefix.toLowerCase()
  ) {
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

const verifyAccessToken = (
  accessToken: string,
  tokenProcessor: TokenProcessor
) => {
  const accessSecret = process.env.ACCESS_SECRET!;
  const { sub, data } = tokenProcessor.verifyToken<AccessTokenPayload>(
    accessToken,
    accessSecret
  );
  return { ...sub, ...data };
};

const verifyAndUseRefreshToken = async (
  refreshToken: string,
  tokenProcessor: TokenProcessor,
  res: Response
) => {
  // Get claimed user id
  const claims = tokenProcessor.decodeToken(refreshToken);
  if (!claims?.sub || !mongoose.isValidObjectId(claims.sub)) {
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

  /*
   * The idea for this extra `try-catch` block is to throw the appropriate error
   *   so that the user gets a correct error response.
   * The user is more likely to be unauthorized if the token verification process fails.
   * If we do not catch the verification error, the handler middleware will default to
   *   a response with 500 error status.
   * Please see error handler middleware inside of the `middlewares` folder.
   */
  try {
    tokenProcessor.verifyToken<RefreshTokenPayload>(
      refreshToken,
      refreshSecret
    );
  } catch (error) {
    throw new UnauthorizedError();
  }

  // Assign new tokens
  const [newRefreshToken, newAccessToken] = await signTokens(user, true, res);
  res.set("Access-Control-Expose-Headers", "X-Access-Token, X-Refresh-Token");
  res.setHeader("X-Access-Token", newAccessToken);
  res.setHeader("X-Refresh-Token", newRefreshToken);
  return { id: user._id || user.id, role: user.role };
};

export const requireAuth = async (
  req: Request,
  res: Response<ResBody>,
  next: NextFunction
) => {
  const accessToken = extractTokenFromHeader(req, "Authorization", "bearer");
  if (!accessToken) {
    throw new UnauthorizedError();
  }

  const algorithm = tokenConfig.algorithms.access;

  const tokenProcessor = new TokenProcessor(algorithm);
  try {
    req.user = verifyAccessToken(accessToken, tokenProcessor);
  } catch (error) {
    console.info("Access token not working or expired.");
    // Try refresh token
    const refreshToken = extractTokenFromHeader(
      req,
      "X-Refresh-Token",
      "refresh"
    );

    req.user = await verifyAndUseRefreshToken(
      refreshToken,
      tokenProcessor,
      res
    );
  }

  // Request rate limiting
  try {
    await userRequestRateLimiter.consume(req.user.id, 1);
  } catch (rateLimiterRes) {
    setRateLimitErrorHeaders(res, rateLimiterRes);
    throw new RateLimitedError();
  }

  return next();
};
