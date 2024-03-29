#!/usr/bin/env ts-node-esm

import { createServer } from "restify";

const app = createServer();

app.get("/", async (req, res) => res.send({ hello: "world" }));

app.listen(3000, () => process.send?.("READY"));
