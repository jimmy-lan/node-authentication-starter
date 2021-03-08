/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { UserRole } from "./UserRole";

export enum TokenType {
  bearer = "bearer",
  refresh = "refresh",
  reset = "reset",
}

export interface TokenPayload {
  sub: string;
  iat: number;
  exp?: number;
  data: Object;
}

export interface AuthTokenPayload extends TokenPayload {
  data: {
    role: UserRole;
  };
}
