/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import { Request, Response, Router } from "express";
import { body } from "express-validator";

import { AuthResBody, UserRole } from "../../types";
import { User } from "../../models";
import { validateRequest } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { PasswordEncoder } from "../../services";
import { signTokens } from "../../util";
import { tokenConfig } from "../../config";

const router = Router();

/**
 * Check if user with <email> exists. If true, throw
 * an error to terminate the process.
 *
 * @param email user's email to be check
 * @throws BadRequestError
 */
const abortIfUserExists = async (email: string) => {
  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    const errorMessage = `Email ${email} is in use.`;
    throw new BadRequestError(errorMessage);
  }
};

router.post(
  "/signup",
  [
    body("email")
      .normalizeEmail({ gmail_remove_dots: false })
      .isEmail()
      .isLength({ min: 6, max: 80 }),
    // TODO Implement a stricter password security check
    body("password").isLength({ min: 6, max: 50 }),
    body("firstName")
      .isString()
      .isLength({ min: 2, max: 50 })
      .not()
      .contains(" "),
    body("lastName")
      .isString()
      .isLength({ min: 2, max: 50 })
      .not()
      .contains(" "),
  ],
  validateRequest,
  async (req: Request, res: Response<AuthResBody>) => {
    const { email, password, firstName, lastName } = req.body;

    await abortIfUserExists(email);

    const user = User.build({
      email,
      password,
      clientSecret: PasswordEncoder.randomString(
        tokenConfig.clientSecretLength
      ),
      profile: { name: { first: firstName, last: lastName } },
      role: UserRole.member,
    });

    await user.save();

    const [refreshToken, accessToken] = await signTokens(user);
    const payload = { refreshToken, accessToken, user };

    return res.status(201).json({ success: true, payload });
  }
);

export { router as signUpRouter };
