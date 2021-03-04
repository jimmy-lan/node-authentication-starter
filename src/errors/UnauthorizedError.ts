/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */

import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
  statusCode = 401;

  constructor(message?: string) {
    super(message || "Unauthorized");

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
