#!/usr/bin/env ts-node-esm

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import rayo from "rayo";

const app = rayo({ port: 3000 });

app.get("/", (req: any, res: any) => res.end(JSON.stringify({ hello: "world" })));

app.start();
