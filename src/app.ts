/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import express from "express";
import mongoose from "mongoose";

// Router Imports
import { authRouter } from "./routers";

const app = express();

// Connect to DB
mongoose
  .connect(process.env.DB_URI!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`[${app.get("name")}] Connected to database.`);
  })
  .catch((error: Error) => {
    console.error(error);
  });

// Register routers
app.use("/api/v1/users", authRouter);

export { app };
