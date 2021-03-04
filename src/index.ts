/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import { config } from "dotenv";
import errorhandler from "errorhandler";

import { app } from "./app";

// Environmental variables
// Remove this line if the variables are not loaded from
// dotenv files.
config();

// Server configurations
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || app.get("env");
const SERVER_NAME = process.env.SERVER_NAME || "Server";

// Provide full stack trace
if (ENVIRONMENT === "development") {
  app.use(errorhandler);
}

// Start server
app.listen(PORT, () => {
  console.group(`[${SERVER_NAME}] Server started successfully.`);
  console.info(`PORT: ${PORT}`);
  console.info(`ENV: ${ENVIRONMENT}`);
  console.info(`TIME: ${new Date()}`);
  console.groupEnd();
});
