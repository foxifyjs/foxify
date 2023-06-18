#!/usr/bin/env ts-node-esm

import http from "node:http";
import { serve } from "micro";

const server = new http.Server(serve(async () => ({ hello: "world" })));

server.listen(3000, () => process.send?.("READY"));
