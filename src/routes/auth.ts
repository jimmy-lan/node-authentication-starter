/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 * Description: Routers to handle user authentication.
 */
import { Router, Request, Response } from "express";
import { User } from "../models";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().isLength({ min: 6, max: 80 }),
    body("password").isStrongPassword({ minLength: 6 }),
    body("firstName").isLength({ min: 2, max: 50 }),
    body("lastName").isLength({ min: 2, max: 50 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    const user = User.build({
      email,
      password,
      profile: { name: { first: firstName, last: lastName } },
    });

    return res.send({ received: true });
  }
);

export { router as authRouter };
