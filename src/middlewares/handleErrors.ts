/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */

import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";
import { ResBody } from "../types";

/**
 * Middleware to handle async errors thrown during execution.
 * Works with HttpError class. Subclass HttpError to create a custom error.
 * This function can be added to a project that:
 * - (1) has library `express-async-errors` installed;
 * - (2) has an import statement of `express-async-errors` as early as possible;
 * - (3) keeps the arguments to this middleware "as is". Although the `next`
 *       parameter is not used, it cannot be removed because express would otherwise
 *       treat this middleware function differently.
 *
 * @see HttpError
 * @param error
 *    The error thrown during execution, to be passed in by express and express-async-errors.
 * @param req Request provided by express.
 * @param res Response provided by express.
 * @param next Next function provided by express. **DO NOT REMOVE!**
 */
export const handleErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ResBody = {
    success: false,
    errors: [{ message: "Oops, we can't process this request right now." }],
  };

  if (error instanceof HttpError) {
    response.errors = error.serializeErrors();
    return res.status(error.statusCode).send(response);
  }

  console.error(error);

  return res.status(500).send(response);
};
