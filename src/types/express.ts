/*
 * Created by Jimmy Lan
 */

import { AccessTokenPayload } from "./Token";

// Override Express declaration to include currentUser property
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload["sub"] & AccessTokenPayload["data"];
    }
  }
}
