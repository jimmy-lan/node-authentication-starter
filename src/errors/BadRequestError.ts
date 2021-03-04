/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */
import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
  statusCode = 400;

  constructor(message?: string) {
    super(message || "Bad request");

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
