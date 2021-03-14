/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-12
 */

import { Request, Response, Router } from "express";

import { ResetTokenPayload, ResPayload } from "../../types";
import { body, query } from "express-validator";
import { validateRequest } from "../../middlewares";
import {
  authBruteIPRateLimiter,
  passwordResetRateLimiter,
  TokenProcessor,
  TokenType,
} from "../../services";
import { setRateLimitErrorHeaders } from "../../util";
import { RateLimitedError } from "../../errors";
import { User, UserDocument } from "../../models";
import { LeanDocument } from "mongoose";
import { TemplateEmailSender } from "../../services/EmailSender";

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

const getPasswordResetToken = (user: LeanDocument<UserDocument>) => {
  const tokenProcessor = new TokenProcessor("HS256");
  const userId = user._id || user.id;
  const resetSecret = process.env.RESET_SECRET!;
  return tokenProcessor.issueToken<ResetTokenPayload>(
    { sub: userId },
    resetSecret,
    TokenType.reset
  );
};

const verifyPasswordResetToken = (token: string) => {
  const tokenProcessor = new TokenProcessor("HS256");
  const resetSecret = process.env.RESET_SECRET!;
  return tokenProcessor.verifyToken<ResetTokenPayload>(token, resetSecret);
};

const sendPasswordResetEmail = async (
  user: LeanDocument<UserDocument>,
  token: string
) => {
  const { first } = user.profile.name;
  const name = first;
  const link = `http://localhost:5000/api/v1/users/reset-password/${token}`;

  try {
    await new TemplateEmailSender()
      .setRecipient(user.email)
      .setFrom("account@thepolyteam.com")
      .setTemplateId("d-9c30543786c5498c9281c32e8d552683")
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
      .setRecipient(user.id)
      .setFrom("account@thepolyteam.com")
      .setTemplateId("d-c7534e35a1f5472d957df1a4b6120d1a")
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
  async (req: Request, res: Response<ResPayload>) => {
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
    query("token").isLength({ min: 10 }),
    body("newPassword").isLength({ min: 6, max: 50 }),
  ],
  validateRequest,
  (req: Request, res: Response<ResPayload>) => {
    const { token } = req.query;
    const { newPassword } = req.body;
  }
);

export { router as resetPasswordRouter };
