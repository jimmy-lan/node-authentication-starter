/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */

import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  statusCode = 404;

  constructor(message?: string) {
    super(message || "Resource not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
