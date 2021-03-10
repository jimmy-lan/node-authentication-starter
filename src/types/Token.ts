/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-08
 */

import { UserRole } from "./UserRole";
import { TokenPayload } from "../services";

export interface AuthTokenPayload extends TokenPayload {
  data: {
    role: UserRole;
  };
}
