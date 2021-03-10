/*
 * Created by Jimmy Lan
 * Creation Date: 2020-11-30
 */
import { Request, Response } from "express";
import { HttpError } from "../errors";
import { ResPayload } from "../types";

export const handleErrors = (error: Error, req: Request, res: Response) => {
  const response: ResPayload = {
    success: false,
    errors: [{ message: "Oops, we can't process this request right now." }],
  };

  if (error instanceof HttpError) {
    console.log("HttpError");
    response.errors = error.serializeErrors();
    return res.status(error.statusCode).send(response);
  }

  console.error(error);

  return res.status(500).send(response);
};
