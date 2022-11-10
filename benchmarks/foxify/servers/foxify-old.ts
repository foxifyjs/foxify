#!/usr/bin/env ts-node-esm

import Foxify from "foxify-old";

const app = (new Foxify);

app.disable("x-powered-by");

app.set("workers", 1);

const schema = {
  response: {
    200: {
      type      : "object",
      properties: {
        hello: {
          type: "string",
        },
      },
    },
  },
};

app.get("/", { schema } as any, (req, res) => res.json({ hello: "world" }));

app.start();
