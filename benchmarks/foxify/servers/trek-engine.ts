#!/usr/bin/env ts-node-esm

import assert from "node:assert";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import Trek from "trek-engine";

const app = (new Trek);

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(async ({ res }) => {
  res.body = {
    hello: "world",
  };
});

app.on("error", (err: any) => {
  assert(err instanceof Error, `non-error thrown: ${ err }`);

  // eslint-disable-next-line eqeqeq
  if ((err as any).status == 404 || (err as any).expose) return;

  const msg = err.stack ?? err.toString();

  console.error();
  console.error(msg.replace(/^/gm, "  "));
  console.error();
});

app.run(3000, () => process.send?.("READY"));
