#!/usr/bin/env ts-node-esm

import express from "express";

const app = express();

app.disable("x-powered-by");

app.disable("etag");

app.get("/", (req, res) => res.json({ hello: "world" }));

app.listen(3000, () => process.send?.("READY"));
