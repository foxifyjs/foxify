#!/usr/bin/env ts-node-esm

import polka from "polka";

const app = polka();

app.get("/", (req, res) => res.end(JSON.stringify({ hello: "world" })));

app.listen(3000);
