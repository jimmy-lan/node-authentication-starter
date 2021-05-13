/*
 * Created by Jimmy Lan
 * Creation Date: 2021-05-02
 * Description:
 *     Route to obtain the current signed in user.
 *     If no authorization header is present or the authorization header provided
 *     is invalid, an unauthorized error will be thrown.
 */

import { Router, Request, Response } from "express";
import { ResBody, UserRole } from "../../types";
import { requireAuth } from "../../middlewares";
import { User } from "../../models";
import { UnauthorizedError } from "../../errors";

/**
 * Response body structure for the get current user route.
 */
export interface CurrentUserResBody extends ResBody {
  payload: {
    email: string;
    role: UserRole;
    profile: {
      name: {
        first: string;
        last: string;
      };
      avatar?: string;
    };
  };
}

const router = Router();

router.get(
  "/current",
  requireAuth,
  async (req: Request, res: Response<CurrentUserResBody>) => {
    const authUser = req.user!;

    const user = await User.findById(authUser.id).lean();

    if (!user) {
      throw new UnauthorizedError();
    }

    const {
      email,
      profile: {
        name: { first, last },
        avatar,
      },
      role,
    } = user;

    return res.json({
      success: true,
      payload: {
        email,
        role,
        profile: {
          name: {
            first,
            last,
          },
          avatar,
        },
      },
    });
  }
);

export { router as currentUserRoute };
