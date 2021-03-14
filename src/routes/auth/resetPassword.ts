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

    const [resEmailAndIP, resIP] = await Promise.all([
      authBruteIPRateLimiter.get(ip),
      passwordResetRateLimiter.get(emailIPKey),
    ]);

    let exceedRateLimiterRes;
    // The block time for single IP is higher than email + ip pair
    // Therefore, resIP is checked first.
    if (resIP && resIP.consumedPoints > 50) {
      exceedRateLimiterRes = resIP;
    } else if (resEmailAndIP && resEmailAndIP.consumedPoints > 1) {
      exceedRateLimiterRes = resEmailAndIP;
    }

    if (exceedRateLimiterRes) {
      setRateLimitErrorHeaders(res, exceedRateLimiterRes);
      throw new RateLimitedError();
    }
  }
);
