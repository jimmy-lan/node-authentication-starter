/*
 * Created by Jimmy Lan
 * Creation Date: 2020-12-03
 */

import { HttpError } from "./HttpError";

export class ForbiddenError extends HttpError {
  statusCode = 403;

  constructor(message?: string) {
    super(message || "Forbidden");

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
