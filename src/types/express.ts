// Override Express declaration to include currentUser property
import { AccessTokenPayload } from "./Token";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload["sub"] & AccessTokenPayload["data"];
    }
  }
}
