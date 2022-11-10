#!/usr/bin/env ts-node-esm

import cors from "cors";
import dnsPrefetchControl from "dns-prefetch-control";
import express from "express";
import frameguard from "frameguard";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import hsts from "hsts";
import ienoopen from "ienoopen";
import xXssProtection from "x-xss-protection";

const app = express();

app.disable("x-powered-by");

app.disable("etag");

app.use(cors());
app.use(dnsPrefetchControl());
app.use((frameguard as any)());
app.use(hsts());
app.use((ienoopen as any)());
app.use((xXssProtection as any)());

app.get("/", (req, res) => res.json({ hello: "world" }));

app.listen(3000);
