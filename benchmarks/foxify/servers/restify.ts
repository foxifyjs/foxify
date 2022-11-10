#!/usr/bin/env ts-node-esm

import { createServer } from "restify";

const app = createServer();

app.get("/", (req, res) => res.send({ hello: "world" }));

app.listen(3000);
