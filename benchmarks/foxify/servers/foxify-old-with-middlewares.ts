#!/usr/bin/env ts-node-esm

import cors from "cors";
import dnsPrefetchControl from "dns-prefetch-control";
import Foxify from "foxify-old";
import frameguard from "frameguard";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import hsts from "hsts";
import ienoopen from "ienoopen";
import xXssProtection from "x-xss-protection";

// eslint-disable-next-line new-cap
const app = (new Foxify);

app.disable("x-powered-by");

app.set("workers", 1);

app.use(cors());
app.use(dnsPrefetchControl());
app.use((frameguard as any)());
app.use(hsts());
app.use((ienoopen as any)());
app.use((xXssProtection as any)());

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
