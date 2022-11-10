#!/usr/bin/env ts-node-esm

import micro from "micro";

const server = micro.default(async () => ({ hello: "world" }));

(server as any).listen(3000);
