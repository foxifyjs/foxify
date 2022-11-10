#!/usr/bin/env ts-node-esm

// eslint-disable-next-line import/no-named-as-default
import fastify from "fastify";

const app = fastify.default();

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
