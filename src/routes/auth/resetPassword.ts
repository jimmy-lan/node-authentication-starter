/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-12
 */

import { Router, Request, Response } from "express";

import { ResPayload } from "../../types";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import {
  authBruteIPRateLimiter,
  passwordResetRateLimiter,
} from "../../services";
import { setRateLimitErrorHeaders } from "../../util";
import { RateLimitedError } from "../../errors";

const router = Router();

router.post(
  "/resetPassword",
  [
    body("email")
      .normalizeEmail({ gmail_remove_dots: false })
      .isEmail()
      .isLength({ min: 6, max: 80 }),
  ],
  validateRequest,
  async (req: Request, res: Response<ResPayload>) => {
    const ip = req.ip;
    const { email } = req.body;
    const emailIPKey = `${email}${ip}`;

    try {
      await authBruteIPRateLimiter.consume(ip);
      await passwordResetRateLimiter.consume(emailIPKey);
    } catch (rateLimiterRes) {
      if (rateLimiterRes instanceof Error) {
        throw rateLimiterRes;
      }
      setRateLimitErrorHeaders(res, rateLimiterRes);
      throw new RateLimitedError();
    }

    // TODO try send email
  }
);
