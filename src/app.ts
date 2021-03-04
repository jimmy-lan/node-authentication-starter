/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import express from "express";
import mongoose from "mongoose";

// Router Imports
import { authRouter } from "./routes";
import { getMissingEnvVariables } from "./util";

const app = express();

// Check for missing environment variables
const requiredVariables = ["DB_URI"];
const missingVariables = getMissingEnvVariables(requiredVariables);

if (missingVariables.length) {
  console.error(
    `Missing environment Variables: ${missingVariables.join(", ")}`
  );
  console.warn("Process exiting.");
  process.exit(1);
}

// Connect to DB
mongoose
  .connect(process.env.DB_URI!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to database.`);
  })
  .catch((error: Error) => {
    console.error(error);
  });

// App settings
app.set("port", process.env.PORT || 3000);
app.set("env", process.env.NODE_ENV || app.get("env"));

// Middlewares
app.use(express.json());

// Register routers
app.use("/api/v1/users", authRouter);

export { app };
