/*
 * Created by Jimmy Lan
 * Creation Date: 2021-05-10
 */

import { Request, Response, Router } from "express";

import { requireAuth } from "../../middlewares";
import { User } from "../../models";
import { NotFoundError } from "../../errors";
import { PasswordEncoder } from "../../services";
import { tokenConfig } from "../../config";
import { ResBody } from "../../types";

interface SignOutResBody extends ResBody {
  payload: {
    id: string;
    email: string;
  };
}

const router = Router();

router.post(
  "/signout",
  requireAuth,
  async (req: Request, res: Response<SignOutResBody>) => {
    const userId = req.user!.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(`User ${userId} not found.`);
    }

    user.clientSecret = PasswordEncoder.randomString(
      tokenConfig.clientSecretLength
    );
    await user.save();

    return res.json({
      success: true,
      payload: { id: user._id || user.id, email: user.email },
    });
  }
);
