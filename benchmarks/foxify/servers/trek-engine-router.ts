#!/usr/bin/env ts-node-esm

import assert from "node:assert";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import Trek from "trek-engine";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import Router from "trek-router";

const app = (new Trek);
const router = (new Router);

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
router.add("GET", "/", async ({ res }) => {
  res.body = {
    hello: "world",
  };
});

app.use(async (ctx: any) => {
  const { req } = ctx;
  const [handler, params] = router.find(req.method, req.url);

  if (handler) {
    req.params = params;

    return handler(ctx);
  }
});

app.on("error", (err: any) => {
  assert(err instanceof Error, `non-error thrown: ${ err }`);

  if ((err as any).status === 404 || (err as any).expose) return;

  const msg = err.stack ?? err.toString();

  console.error();
  console.error(msg.replace(/^/gm, "  "));
  console.error();
});

app.run(3000, () => process.send?.("READY"));
