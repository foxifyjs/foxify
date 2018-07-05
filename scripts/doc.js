#!/usr/bin/env node

const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');
const {
  execSync,
} = require('child_process');

const startTime = new Date().getTime();

const cwd = path.join(__dirname, '..');
const outDir = path.join(cwd, 'docs');

rimraf.sync(outDir);

console.log(execSync("npm run typedoc", {
  cwd,
}).toString());

fs.writeFileSync(path.join(outDir, "CNAME"), "foxify.js.org", "utf8");
fs.writeFileSync(path.join(outDir, ".nojekyll"), "", "utf8");

console.log(`finished in ${new Date().getTime() - startTime}ms`);