/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-11
 */

import { HttpError } from "./HttpError";

export class RateLimitedError extends HttpError {
  statusCode = 429;

  constructor(message?: string) {
    super(message || "Rate limited");

    Object.setPrototypeOf(this, RateLimitedError.prototype);
  }
}
