/*
 * Created by Jimmy Lan
 */
import { query } from "express-validator";

const pageLimit = query("limit")
  .optional()
  .isInt({ gt: 0 })
  .withMessage("Pagination parameter 'limit' must be a positive integer.");
const pageSkip = query("skip")
  .optional()
  .isInt({ gt: 0 })
  .withMessage("Pagination parameter 'skip' must be a positive integer.");

export const validators = { pageLimit, pageSkip };
