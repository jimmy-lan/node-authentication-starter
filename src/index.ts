/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import { config } from "dotenv";
import errorhandler from "errorhandler";

// Remove the following if env variables are not loaded from
// dotenv files.
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  config();
}

import "./devsupport/console";
import { app } from "./app";
import { getMissingEnvVariables } from "./util";
import mongoose from "mongoose";

const start = () => {
  // Check for missing environment variables
  const requiredVariables = [
    "DB_URI",
    "ACCESS_SECRET",
    "RESET_SECRET",
    "REFRESH_SECRET",
    "REDIS_URI",
    "SENDGRID_KEY",
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

  // Server configuration
  const PORT = app.get("port");
  const ENVIRONMENT = app.get("env");

  // Provide full stack trace
  if (ENVIRONMENT === "development") {
    app.use(errorhandler);
  }

  // Start server
  app.listen(PORT, () => {
    console.group("Server started successfully.");
    console.info(`PORT: ${PORT}`);
    console.info(`ENV: ${ENVIRONMENT}`);
    console.info(`TIME: ${new Date()}\n`);
    console.groupEnd();
  });
};

start();
