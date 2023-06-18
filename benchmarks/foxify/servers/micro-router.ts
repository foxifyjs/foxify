#!/usr/bin/env ts-node-esm

import http from "node:http";
import { send } from "micro";
import * as microRouter from "microrouter";

const { router, default: { get } } = microRouter;

const server = new http.Server(router(get(
  "/",
  async (req, res) => send(res, 200, { hello: "world" }),
)));

server.listen(3000, () => process.send?.("READY"));
