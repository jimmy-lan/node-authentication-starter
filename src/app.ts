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
import { requireAuth } from "./middlewares/requireAuth";

const app = express();

// Check for missing environment variables
const requiredVariables = [
  "DB_URI",
  "ACCESS_SECRET",
  "REFRESH_SECRET",
  "REDIS_URI",
];
const missingVariables = getMissingEnvVariables(requiredVariables);

if (missingVariables.length) {
  console.error(
    `Missing environment Variables: ${missingVariables.join(", ")}`
  );
  console.warn("Process exiting.");
  process.exit(1);
}

// Connect to Mongo DB
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
app.use("/api/v1/test", requireAuth, (req, res) => {
  return res.json({ success: true, data: "hi" });
});

// Resource not found
app.all("*", () => {
  throw new NotFoundError();
});

// Error fallback
app.use(handleErrors);

export { app };
