#!/usr/bin/env ts-node-esm

import fastifyExpress from "@fastify/express";
import cors from "cors";
import dnsPrefetchControl from "dns-prefetch-control";
// eslint-disable-next-line import/no-named-as-default
import fastify from "fastify";
import frameguard from "frameguard";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import hsts from "hsts";
import ienoopen from "ienoopen";
import xXssProtection from "x-xss-protection";

const app = fastify.default();

await app.register(fastifyExpress.default);

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

app.get("/", { schema }, (req, reply) => reply.send({ hello: "world" }));

app.listen({ port: 3000 });
