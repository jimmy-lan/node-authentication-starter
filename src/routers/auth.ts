/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 * Description: Routers to handle user authentication.
 */
import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.send({ message: "successful" });
});

export { router as authRouter };
