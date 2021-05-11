/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { Router } from "express";

import { signUpRouter } from "./signup";
import { signInRouter } from "./signin";
import { resetPasswordRouter } from "./resetPassword";
import { currentUserRoute } from "./currentUser";
import { signOutRouter } from "./signout";

const router = Router();

router.use(
  signUpRouter,
  signInRouter,
  resetPasswordRouter,
  currentUserRoute,
  signOutRouter
);

export { router as authRouter };
