#!/usr/bin/env ts-node-esm

import connect from "connect";
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import Router from "router";

const app = connect();

// eslint-disable-next-line new-cap
const router = Router();

router.get("/", (req: any, res: any) => {
  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify({ hello: "world" }));
});

app.use(router);

app.listen(3000);
