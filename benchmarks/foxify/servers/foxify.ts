#!/usr/bin/env ts-node-esm

import { SchemaOptionsI } from "@foxify/router";
import Foxify from "foxify";

// eslint-disable-next-line new-cap
const app = (new Foxify.default);

app.disable("x-powered-by");

app.disable("etag");

app.set("workers", 1);

const schema: SchemaOptionsI = {
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

app.get("/", { schema }, (req, res) => res.json({ hello: "world" }));

app.start();
