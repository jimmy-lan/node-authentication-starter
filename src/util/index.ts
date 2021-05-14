/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-04
 */

export * from "./tokens";
export * from "./rateLimit";

/**
 * Get a list of environment variables in `variables` that are missing.
 * If all variables are present in `variables`, return an empty array.
 * @param variables List of names of required environment variables.
 */
export const getMissingEnvVariables = (variables: string[]): string[] => {
  const missingVariables = [];
  for (const variable of variables) {
    if (!process.env[variable]) {
      missingVariables.push(variable);
    }
  }
  return missingVariables;
};
