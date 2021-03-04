/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */

import { ValidationError } from "express-validator";
import { HttpError, SerializedHttpError } from "./HttpError";

type Errors = ValidationError[];

export class RequestValidationError extends HttpError {
  statusCode = 400;

  constructor(public errors: Errors, message?: string, statusCode?: number) {
    super(message || "Validation error");

    if (statusCode) {
      this.statusCode = statusCode;
    }

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): SerializedHttpError[] {
    return this.errors.map((error: ValidationError) => ({
      message: error.msg,
      cause: error.param,
    }));
  }
}
