/*
 * Created by Jimmy Lan
 * Creation Date: 2020-12-01
 */

import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class PasswordEncoder {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(password: string, encodedPassword: string) {
    const [hashedPassword, salt] = encodedPassword.split(".");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedPassword;
  }
}
