/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { Router } from "express";
import { signUpRouter } from "./signup";

const router = Router();

router.use(signUpRouter, signUpRouter);

export { router as authRouter };
