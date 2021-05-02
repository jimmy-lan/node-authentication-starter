/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-12
 */

import { Request, Response, Router } from "express";

import { ResetTokenPayload, ResBody } from "../../types";
import { body, param } from "express-validator";
import { validateRequest } from "../../middlewares";
import {
  authBruteIPRateLimiter,
  passwordResetRateLimiter,
  signInRateLimiter,
  TokenProcessor,
  TokenType,
} from "../../services";
import { setRateLimitErrorHeaders } from "../../util";
import { NotFoundError, RateLimitedError } from "../../errors";
import { User, UserDocument } from "../../models";
import { LeanDocument } from "mongoose";
import { TemplateEmailSender } from "../../services/EmailSender";
import { resetPasswordConfig, tokenConfig } from "../../config";

const router = Router();

const checkRateLimit = async (req: Request, res: Response) => {
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
};

const clearRateLimit = async (
  req: Request,
  user: LeanDocument<UserDocument>
) => {
  const ip = req.ip;
  const emailIpPair = `${user.email}${ip}`;
  await authBruteIPRateLimiter.delete(ip);
  await signInRateLimiter.delete(emailIpPair);
  await passwordResetRateLimiter.delete(emailIpPair);
};

const getPasswordResetToken = (user: LeanDocument<UserDocument>) => {
  const tokenProcessor = new TokenProcessor(tokenConfig.algorithms.reset);
  const userId = user._id || user.id;
  const clientSecret = user.clientSecret;
  const resetSecret = process.env.RESET_SECRET! + clientSecret;
  return tokenProcessor.issueToken<ResetTokenPayload>(
    { sub: userId },
    resetSecret,
    TokenType.reset
  );
};

const decodePasswordResetToken = (token: string) => {
  const tokenProcessor = new TokenProcessor(tokenConfig.algorithms.reset);
  return tokenProcessor.decodeToken(token);
};

const verifyPasswordResetToken = (token: string, clientSecret: string) => {
  const tokenProcessor = new TokenProcessor(tokenConfig.algorithms.reset);
  const resetSecret = process.env.RESET_SECRET! + clientSecret;
  return tokenProcessor.verifyToken<ResetTokenPayload>(token, resetSecret);
};

const sendPasswordResetEmail = async (
  user: LeanDocument<UserDocument>,
  token: string
) => {
  const { first } = user.profile.name;
  const name = first;
  const link = `${resetPasswordConfig.passwordResetLink}/${token}`;

  try {
    await new TemplateEmailSender()
      .setRecipient(user.email)
      .setFrom(resetPasswordConfig.emailSender)
      .setTemplateId(resetPasswordConfig.requestEmailTemplateId)
      .setDynamicTemplateData({
        subject: "Your Password Reset Request",
        name,
        link,
      })
      .send();
  } catch (error) {
    console.log(error.response?.body?.errors);
    throw error;
  }
};

const sendPasswordResetConfirmationEmail = async (
  user: LeanDocument<UserDocument>
) => {
  const { first } = user.profile.name;
  const name = first;

  try {
    await new TemplateEmailSender()
      .setRecipient(user.email)
      .setFrom(resetPasswordConfig.emailSender)
      .setTemplateId(resetPasswordConfig.confirmationEmailTemplateId)
      .setDynamicTemplateData({
        subject: "Password Reset Confirmation",
        name,
      })
      .send();
  } catch (error) {
    console.log(error.response?.body?.errors);
    throw error;
  }
};

/*
 * Route for password-reset request.
 * Users use this route to obtain an email with a password reset link.
 */
router.post(
  "/reset-password",
  [
    body("email")
      .normalizeEmail({ gmail_remove_dots: false })
      .isEmail()
      .isLength({ min: 6, max: 80 }),
  ],
  validateRequest,
  async (req: Request, res: Response<ResBody>) => {
    const { email } = req.body;

    await checkRateLimit(req, res);

    // Find user
    const user = await User.findOne({ email }).lean();
    if (!user) {
      // We do not want the client know that the user does not exist.
      return res.json({ success: true });
    }

    const token = getPasswordResetToken(user);

    await sendPasswordResetEmail(user, token);

    return res.json({ success: true });
  }
);

/*
 * Route for confirming password reset.
 * Users supply a new password to this route.
 */
router.post(
  "/reset-password/:token",
  [
    param("token").notEmpty().isLength({ min: 10 }),
    body("newPassword").isLength({ min: 6, max: 50 }),
  ],
  validateRequest,
  async (req: Request, res: Response<ResBody>) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const claims = decodePasswordResetToken(token);
    const userId = claims?.sub;
    if (!userId) {
      throw new NotFoundError();
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError();
    }

    verifyPasswordResetToken(token, user.clientSecret);

    // Reset password
    user.password = newPassword;
    await user.save();

    // Clear rate limiter
    await clearRateLimit(req, user);

    await sendPasswordResetConfirmationEmail(user);

    return res.json({ success: true });
  }
);

export { router as resetPasswordRouter };
