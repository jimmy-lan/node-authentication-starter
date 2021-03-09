/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import "express-async-errors";

// Router Imports
import { authRouter } from "./routes";
import { getMissingEnvVariables } from "./util";
import { handleErrors } from "./middlewares";
import { NotFoundError } from "./errors";

const app = express();

// Check for missing environment variables
const requiredVariables = ["DB_URI", "BEARER_SECRET", "REFRESH_SECRET"];
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
app.use(
  morgan("tiny", {
    stream: {
      write(str: string) {
        console.log(str.trim());
      },
    },
  })
);

// Register routers
app.use("/api/v1/users", authRouter);

// Resource not found
app.all("*", () => {
  throw new NotFoundError();
});

// Error fallback
app.use(handleErrors);

export { app };
