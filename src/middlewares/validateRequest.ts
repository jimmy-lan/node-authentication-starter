/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 * Description: Middleware that validate requests using express-validator.
 *
 * PRE-CONDITION:
 * Please include an array of needed validation fields as specified
 * in express-validator's documentation before applying this middleware.
 *
 * @see https://www.npmjs.com/package/express-validator
 */

import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    throw new RequestValidationError(
      validationErrors.array({ onlyFirstError: true })
    );
  }

  next();
};
