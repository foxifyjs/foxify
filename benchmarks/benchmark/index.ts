#!/usr/bin/env ts-node-esm

import { program } from "commander";
import { servers, suites } from "./commands/index.js";

program
  .addCommand(servers)
  .addCommand(suites)
  .action(() => program.help())
  .helpOption()
  .parse();
