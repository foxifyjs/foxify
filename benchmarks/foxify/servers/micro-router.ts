#!/usr/bin/env ts-node-esm

import micro, { send } from "micro";
import * as microRouter from "microrouter";

const server = micro.default(microRouter.router(microRouter.default.get(
  "/",
  async (req, res) => send(res, 200, { hello: "world" }),
)));

(server as any).listen(3000, () => process.send?.("READY"));
