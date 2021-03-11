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

const start = () => {
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
