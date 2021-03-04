/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";
import { ResponseBody } from "../models";

export const handleErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ResponseBody = {
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
