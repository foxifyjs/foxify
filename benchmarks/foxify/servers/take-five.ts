#!/usr/bin/env ts-node-esm

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error,@typescript-eslint/ban-ts-comment
// @ts-ignore
import Five from "take-five";

const app = (new Five);

app.get("/", (req: any, res: any) => res.send({ hello: "world" }));

app.listen(3000, () => process.send?.("READY"));
