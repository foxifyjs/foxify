#!/usr/bin/env ts-node-esm

import { Server } from "hapi";

const server = new Server({
  port : 3000,
  debug: false,
});

server.route({
  method : "GET",
  path   : "/",
  options: {
    cache   : false,
    response: {
      ranges: false,
    },
    state: {
      parse: false,
    },
  },
  handler: () => ({ hello: "world" }),
});

server.start();
