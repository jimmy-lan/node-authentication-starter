/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-04
 * Description:
 *   This file overrides the default behaviour of console.log, console.info,
 *   console.warn, and console.error.
 */

// Obtain needed variables
const SERVER_NAME = process.env.SERVER_NAME || "Server";
const PREFIX = `[${SERVER_NAME}]`;
const IS_DEBUG =
  !process.env.DEBUG || process.env.DEBUG.toLowerCase() === "true";
const SHOULD_LOG_NAME =
  !process.env.LOG_SERVER_NAME ||
  process.env.LOG_SERVER_NAME.toLowerCase() === "true";

/**
 * Return current time in the format hh:mm:ss.
 */
const getCurrentTimeString = (): string => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hour}:${minute}:${seconds}`;
};

/**
 * Get new logging method to substitute the default console
 * logging behaviour.
 * @param logMethod Old logging method. e.g. console.log, console.warn.
 * @param ignoreDebug If true, the environment variable DEBUG will not be used
 * to determine whether to output log.
 */
const getNewLogMethod = (logMethod: Function, ignoreDebug: boolean = false) => (
  ...args: any[]
) => {
  const argsList = Array.from(args);
  const timeString = getCurrentTimeString();
  if (SHOULD_LOG_NAME) {
    argsList.unshift(PREFIX);
  }
  argsList.unshift(timeString);
  if (IS_DEBUG || ignoreDebug) {
    logMethod.apply(console, argsList);
  }
};

console.log = getNewLogMethod(console.log);
console.info = getNewLogMethod(console.info);
console.warn = getNewLogMethod(console.warn, true);
console.error = getNewLogMethod(console.error, true);
