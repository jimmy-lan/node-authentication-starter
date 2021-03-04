/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */

import { HttpError } from "./HttpError";

export class UnprocessableEntityError extends HttpError {
  statusCode = 422;

  constructor(message?: string) {
    super(message || "Unprocessable entity");

    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}
