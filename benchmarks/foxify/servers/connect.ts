#!/usr/bin/env ts-node-esm

import connect from "connect";

const app = connect();

app.use((req, res) => {
  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify({ hello: "world" }));
});

app.listen(3000, () => process.send?.("READY"));
