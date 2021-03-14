/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { UserRole } from "./UserRole";
import { TokenPayload } from "../services";

export interface AccessTokenPayload extends TokenPayload {
  sub: {
    id: string;
  };
  data: {
    role: UserRole;
  };
}

export interface RefreshTokenPayload extends TokenPayload {
  sub: string;
}

export interface ResetTokenPayload extends TokenPayload {
  sub: string;
}
