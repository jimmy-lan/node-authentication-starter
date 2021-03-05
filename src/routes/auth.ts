/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 * Description: Routers to handle user authentication.
 */

import { Router, Request, Response } from "express";
import { ResponseBody, User } from "../models";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";

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

    const user = User.build({
      email,
      password,
      profile: { name: { first: firstName, last: lastName } },
    });

    return res.json({ success: true });
  }
);

export { router as authRouter };
