/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { Router } from "express";

import { signUpRouter } from "./signup";
import { signInRouter } from "./signin";

const router = Router();

router.use(signUpRouter, signInRouter);

export { router as authRouter };
