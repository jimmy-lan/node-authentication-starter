/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-14
 * Description:
 *    This configuration file is relating to the token generation
 *    and verification process.
 */

import { TokenType } from "../services";
import { Algorithm } from "jsonwebtoken";

export interface TokenConfig {
  clientSecretLength: number;
  /**
   * Algorithms used to issue and verify each type of token.
   * Under current implementation, we use the same algorithm for refresh
   * and access tokens. Please provide only one of "access" and "refresh"
   * fields. If more than one option is provided, "access" will be used.
   */
  algorithms: Partial<{ [key in keyof typeof TokenType]: Algorithm }>;
  /** Default time for each type of token to expire, measured in milliseconds. */
  defaultExpirations: { [key in keyof typeof TokenType]: number };
}

export const tokenConfig: TokenConfig = {
  /** Length of client secret for every user, with a minimum of 10. */
  clientSecretLength: 20,
  algorithms: {
    access: "HS512",
    reset: "HS256",
  },
  defaultExpirations: {
    access: 5 * 60 * 1000,
    refresh: 7 * 24 * 60 * 1000,
    reset: 10 * 60 * 1000,
  },
};
