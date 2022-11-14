#!/usr/bin/env ts-node-esm

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import total from "total.js";

total.http("release", {
  ip  : "127.0.0.1",
  port: 3000,
});

total.route("/", function handler(this: any) {
  this.json({ hello: "world" });
});

process.send?.("READY");
