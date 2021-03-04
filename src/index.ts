/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-03
 */

import { config } from "dotenv";
import errorhandler from "errorhandler";

// Remove this line if env variables are not loaded from
// dotenv files.
config();

import { app } from "./app";
import { getMissingEnvVariables } from "./util";

// Server configuration
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || app.get("env");
const SERVER_NAME = process.env.SERVER_NAME || "Server";

// Check for missing environment variables
const requiredVariables = ["DB_URI"];
const missingVariables = getMissingEnvVariables(requiredVariables);

if (missingVariables.length) {
  console.error(
    `[${SERVER_NAME}] Missing environment Variables: ${missingVariables.join(
      ", "
    )}`
  );
  console.warn(`[${SERVER_NAME}] Process exiting.`);
  process.exit(1);
}

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
  console.log();
});
