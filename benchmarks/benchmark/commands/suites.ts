/* eslint-disable no-await-in-loop,@typescript-eslint/no-explicit-any */
import { readdir } from "node:fs/promises";
import { resolve, basename, extname } from "node:path";
import { cwd } from "node:process";
import benchmarks from "beautify-benchmark";
import benchmark from "benchmark";
import { Command } from "commander";
import logSymbol from "log-symbols";

async function action(): Promise<void> {
// eslint-disable-next-line import/no-named-as-default-member
  const { Suite } = benchmark;

  const SUITES_PATH = resolve(cwd(), "suites");

  const SUITES = await readdir(SUITES_PATH);

  SUITES.sort((a, b) => a.localeCompare(b));

  for (const SUITE_PATH of SUITES) {
    const SUITE: Array<[name: string, fn: () => unknown]> = (await import(resolve(SUITES_PATH, SUITE_PATH))).default;

    SUITE.sort((a, b) => a[0].localeCompare(b[0]));

    const suite = (new Suite);

    for (const [name, fn] of SUITE) suite.add(name, fn);

    console.info(`${ logSymbol.info } Benchmark: ${ basename(SUITE_PATH, extname(SUITE_PATH)) }`);

    suite
      .on("cycle", (event: any) => benchmarks.add(event.target))
      .on("complete", () => benchmarks.log())
      .run();
  }
}

export default new Command("suites")
  .action(action)
  .helpOption();
