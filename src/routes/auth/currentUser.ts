/*
 * Created by Jimmy Lan
 * Creation Date: 2021-05-02
 * Description:
 *     Route to obtain the current signed in user.
 *     If no authorization header is present or the authorization header provided
 *     is invalid, a forbidden error will be thrown.
 */

import { Router, Request, Response } from "express";
import { ResBody, UserRole } from "../../types";

/**
 * Response body structure for the get current user route.
 */
export interface CurrentUserResBody extends ResBody {
  payload: {
    email: String;
    role: UserRole;
    profile: {
      name: {
        first: String;
        last: String;
      };
      avatar?: String;
    };
  };
}

const router = Router();

router.get("/current", (req: Request, res: Response<CurrentUserResBody>) => {});

export { router };
