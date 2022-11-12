import { rm, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { cwd } from "node:process";

const BUILD_DIR = resolve(cwd(), ".build");

let directoryExists = true;

try {
  const result = await stat(BUILD_DIR);

  if (!result.isDirectory()) directoryExists = false;
} catch (error) {
  directoryExists = false;
}

if (directoryExists) await rm(BUILD_DIR, { recursive: true });
