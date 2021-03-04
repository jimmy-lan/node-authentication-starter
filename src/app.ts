/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import express from "express";

import { authRouter } from "./routers";

const app = express();

app.use("/api/v1/users", authRouter);

export { app };
