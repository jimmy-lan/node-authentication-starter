/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-10
 * Description:
 *   This file stores type declaration for authentication response payloads.
 */

import { ResPayload } from "./ResPayload";
import { UserDocument, UserProps } from "../../models";

/**
 * Response payload from general authentication routes
 * e.g. sign in, sign up routes.
 */
export interface AuthResPayload extends ResPayload {
  payload: {
    user: UserDocument | UserProps;
    refreshToken: string;
    accessToken: string;
  };
}
