import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(64).toString("hex");
  const hash = await scrypt(password, salt, 128);
  const result = `${salt}.${hash.toString("hex")}`;
  return result;
}

export async function comparePassword(enteredPassword, password) {
  const [salt, storedHash] = password.split(".");
  const hash = await scrypt(enteredPassword, salt, 128);
  return hash.toString("hex") === storedHash;
}
