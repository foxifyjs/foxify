import { fileURLToPath } from "node:url";
import { stat, readFile, writeFile } from "node:fs/promises";
import { resolve, relative, dirname } from "node:path";
import { cwd, exit } from "node:process";

const ENCODING = "utf-8" as const;

const BUILDS = [["esm", "module", "import"], ["cjs", "commonjs", "default"]];

const OUTPUT_DIR = ".build";

const CWD = cwd();
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD_DIR = resolve(CWD, OUTPUT_DIR);

const result = await stat(BUILD_DIR);

if (!result.isDirectory()) throw new Error(`Build directory not found: ${ relative(ROOT_DIR, BUILD_DIR) }`);

const originalPKG = JSON.parse(await readFile(resolve(CWD, "package.json"), ENCODING));

if (originalPKG.type === "module") exit();

const original = JSON.stringify(originalPKG.publishConfig.imports);

for (const [dir, type, condition] of BUILDS) {
  const regex = new RegExp(`^./${ OUTPUT_DIR }/${ dir }/`);

  const imports = JSON.parse(original, (key, value) => {
    if (typeof value === "string") return value.replace(regex, "./");

    if (typeof value === "object") {
      if ("types" in value) return value;

      return value[condition] ?? value;
    }

    return value;
  });

  const pkg = JSON.stringify({ type, imports });

  await writeFile(resolve(BUILD_DIR, dir, "package.json"), pkg, ENCODING);
}
