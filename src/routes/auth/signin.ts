/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-09
 */

import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../../middlewares";
import { User } from "../../models";
import { UnauthorizedError } from "../../errors";
import { PasswordEncoder } from "../../services";
import { AuthResPayload } from "../../types";
import { signTokens } from "../../util";

const router = Router();

router.post(
  "/signin",
  [
    body("email")
      .normalizeEmail({ gmail_remove_dots: false })
      .isEmail()
      .isLength({ min: 6, max: 80 }),
    body("password").notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response<AuthResPayload>) => {
    const { email, password } = req.body;
    const invalidCredentialsMessage = "Invalid email or password.";

    // Find user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new UnauthorizedError(invalidCredentialsMessage);
    }

    // Verify password
    const isMatch = await PasswordEncoder.compare(
      password,
      existingUser.password
    );
    if (!isMatch) {
      throw new UnauthorizedError(invalidCredentialsMessage);
    }

    const [refreshToken, accessToken] = await signTokens(existingUser);
    const payload = {
      refreshToken: refreshToken,
      accessToken: accessToken,
      user: existingUser,
    };

    return res.json({
      success: true,
      payload,
    });
  }
);

export { router as signInRouter };
