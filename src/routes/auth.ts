/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 * Description: Routers to handle user authentication.
 */
import { Router, Request, Response } from "express";
import { User } from "../models";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const user = User.build({
    email,
    password,
    profile: { name: { first: firstName, last: lastName } },
  });

  return res.json({ received: true });
});

export { router as authRouter };
