import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt); // scrypt is callback based

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buff.toString()}.${salt}`;
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [targetPass, salt] = storedPassword.split(".");
    const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    const saltedPass = buff.toString("hex");
    return saltedPass === targetPass;
  }
}

//Static method in a class can be accessed as - Password.toHash('abc')
