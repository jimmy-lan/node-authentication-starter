/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-10
 * Description:
 *   This file stores type declaration for authentication response payloads.
 */

import { ResBody } from "./ResBody";
import { UserDocument, UserProps } from "../../models";

/**
 * Response body for general authentication routes
 * e.g. sign in, sign up routes.
 */
export interface AuthResBody extends ResBody {
  payload: {
    user: UserDocument | UserProps;
    refreshToken: string;
    accessToken: string;
  };
}
