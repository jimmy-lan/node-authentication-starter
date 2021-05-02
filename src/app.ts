/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import express from "express";
import morgan from "morgan";
import "express-async-errors";

// Router Imports
import { authRouter } from "./routes";
import { handleErrors } from "./middlewares";
import { NotFoundError } from "./errors";
import { requireAuth, rateLimitIp } from "./middlewares";

const app = express();

// App settings
app.set("port", process.env.PORT || 3000);
app.set("env", process.env.NODE_ENV || app.get("env"));

// Middlewares
app.use(express.json());
app.use(
  morgan("tiny", {
    skip() {
      return process.env.NODE_ENV === "test";
    },
    stream: {
      write(str: string) {
        console.log(str.trim());
      },
    },
  })
);
app.use(rateLimitIp);

// Register routers
app.use("/api/v1/users", authRouter);

// Resource not found
app.all("*", () => {
  throw new NotFoundError();
});

// Error fallback
app.use(handleErrors);

export { app };
