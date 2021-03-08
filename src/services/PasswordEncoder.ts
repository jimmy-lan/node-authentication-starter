/*
 * Created by Jimmy Lan
 * Creation Date: 2021-03-05
 */

import { compare, genSalt, hash } from "bcrypt";
import { randomBytes } from "crypto";
import { InternalServerError } from "../errors";

export class PasswordEncoder {
  static async toHash(password: string): Promise<string> {
    let buf;

    try {
      const salt = await genSalt(12);
      buf = await hash(password, salt);
    } catch (error) {
      throw new InternalServerError("Error in password processing.");
    }

    return buf;
  }

  static compare(password: string, encodedPassword: string): Promise<boolean> {
    return compare(password, encodedPassword);
  }

  static randomString(length: number): string {
    return randomBytes(64).toString("hex").slice(0, length);
  }
}
