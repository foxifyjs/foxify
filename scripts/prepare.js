#!/usr/bin/env node

const path = require("path");
const rimraf = require("rimraf");
const {
  spawn
} = require("child_process");

const startTime = new Date().getTime();

const outDir = path.join(__dirname, "..", "framework");

rimraf.sync(outDir);

const tsc = spawn(path.join(__dirname, "..", "node_modules", ".bin", "tsc"));

tsc.stdout.on("data", (data) => console.log(`stdout: ${data}`));

tsc.stderr.on("data", (data) => console.log(`stderr: ${data}`));

tsc.on("close", (code) => {
  if (code === 0) console.log(`finished in ${new Date().getTime() - startTime}ms`);
  else console.error(`child process exited with code ${code}`);
});