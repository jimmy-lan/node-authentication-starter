/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 * Description: Routers to handle user authentication.
 */

import { Request, Response, Router } from "express";
import { ResponseBody, UserRole } from "../../models";
import { User } from "../../schemas";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { PasswordEncoder } from "../../services/PasswordEncoder";

const router = Router();

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
  async (req: Request, res: Response<ResponseBody>) => {
    const { email, password, firstName, lastName } = req.body;

    await abortIfUserExists(email);

    const user = User.build({
      email,
      password,
      clientSecret: PasswordEncoder.randomString(20),
      profile: { name: { first: firstName, last: lastName } },
      role: UserRole.member,
    });

    await user.save();

    return res.status(201).json({ success: true, data: user });
  }
);

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

export { router as signUpRouter };
