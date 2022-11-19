/* eslint-disable no-await-in-loop,@typescript-eslint/no-explicit-any */
import { fork } from "node:child_process";
import { readdir } from "node:fs/promises";
import { resolve, basename, extname } from "node:path";
import { cwd } from "node:process";
import autocannon, { Options as AutoCannonOptionsI } from "autocannon";
import { Command } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import { table, getBorderCharacters } from "table";

interface OptionsI {
  connections: number;
  duration: number;
  pipelining: number;
  servers: string[];
  silent: boolean;
}

type ResultT = [name: string, version: string, router: string, rps: string, latency: string, throughput: string];

async function action({ connections, duration, pipelining, servers, silent }: OptionsI): Promise<void> {
  const SERVERS_PATH = resolve(cwd(), "servers");

  const INFO = (await import(resolve(SERVERS_PATH, "index.ts"))).default;

  const choices = Object.keys(INFO).sort((a, b) => a.localeCompare(b));

  if (servers.includes("all")) servers = choices;
  else servers = servers.filter(server => choices.includes(server));

  const { selected } = await inquirer.prompt<{ selected: string[] }>(
    [
      {
        type   : "checkbox",
        message: "Select servers",
        name   : "selected",
        choices,
        validate(answer: string): boolean | string {
          if (answer.length < 1) return "You must choose at least one server!";

          return true;
        },
        askAnswered: false,
      },
    ],
    // eslint-disable-next-line no-undefined
    { selected: servers.length > 0 ? servers : undefined },
  );

  const spinner = ora("Locating servers").start();

  let SERVERS = await readdir(SERVERS_PATH);

  SERVERS = SERVERS.filter(name => selected.includes(basename(name, extname(name))));

  SERVERS.sort((a, b) => basename(a, extname(a)).localeCompare(basename(b, extname(b))));

  const total = SERVERS.length;

  spinner.text = `Starting server benchmarks (0/${ total } servers)`;

  const options: AutoCannonOptionsI = {
    connections,
    duration,
    pipelining,
    url: "http://localhost:3000",
  };

  let count = 0;

  const results: ResultT[] = [];

  for (const SERVER_PATH of SERVERS) {
    count++;

    const progress = `(${ count }/${ total } servers)`;

    const server = basename(SERVER_PATH, extname(SERVER_PATH));

    spinner.color = "gray";
    spinner.text = `Starting ${ server } ${ progress }`;

    const forked = fork(resolve(SERVERS_PATH, SERVER_PATH), { silent });

    await new Promise((r) => {
      forked.once("message", r);
    });

    spinner.color = "magenta";
    spinner.text = `Warming ${ server } ${ progress }`;

    try {
      await autocannon(options);
    } catch (error) {
      console.error(error);
    }

    spinner.color = "yellow";
    spinner.text = `Working ${ server } ${ progress }`;

    try {
      const {
        latency: { average: latency },
        requests: { average: requests },
        throughput: { average: throughput },
      } = await autocannon(options);

      results.push([
        server,
        INFO[server].version,
        INFO[server].router ? "✓" : "✗",
        requests.toLocaleString("en", {
          style                : "decimal",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }),
        latency.toLocaleString("en", {
          style                : "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        (throughput / 1024 / 1024).toFixed(2),
      ]);
    } catch (error) {
      console.error(error);
    }

    spinner.color = "green";
    spinner.text = `Benchmarked ${ server } ${ progress }`;

    await new Promise((r) => {
      forked.once("close", r);

      forked.kill("SIGINT");
    });
  }

  spinner.succeed("Benchmark completed");

  /**
   * Sort by rps.
   */
  results.sort((a, b) => +(b[3].replaceAll(",", "")) - +(a[3].replaceAll(",", "")));

  results.unshift(["*", "Version", "Router", "Req/Sec", "Latency (ms)", "Throughput (MB)"]);

  // eslint-disable-next-line no-console
  console.log(table(
    results,
    {
      border       : getBorderCharacters("norc"),
      columnDefault: {
        alignment: "right",
      },
      columns: {
        0: {
          alignment: "left",
        },
      },
    },
  ));
}

export default new Command("servers")
  .action(action)
  .option(
    "-c, --connections <connections>",
    "The number of concurrent connections",
    value => +value,
    100,
  )
  .option(
    "-p, --pipelining <pipelining>",
    "The number of pipelined requests  for each connection. Will cause the Client API to throw when greater than 1",
    value => +value,
    10,
  )
  .option(
    "-d, --duration <duration>",
    "The number of seconds to run the autocannon",
    value => +value,
    40,
  )
  .option(
    "--servers <servers>",
    "List of servers to benchmark (comma separated or 'all' for all servers)",
    value => value.split(","),
    [],
  )
  .option(
    "--silent",
    "Don't print the server logs",
    false,
  )
  .helpOption();
