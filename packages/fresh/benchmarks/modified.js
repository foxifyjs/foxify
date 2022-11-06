const { Suite } = require("benchmark");
const fresh = require("fresh");
const foxifyFresh = require("../.build/cjs").default;

new Suite()
  .add("fresh", () => {
    fresh(
      { "if-modified-since": "Mon, 01 Jan 1990 00:00:00 GMT" },
      { "last-modified": "Sat, 01 Jan 2000 00:00:00 GMT" },
    );
  })
  .add("@foxify/fresh", () => {
    foxifyFresh(
      { "if-modified-since": "Mon, 01 Jan 1990 00:00:00 GMT" },
      { "last-modified": "Sat, 01 Jan 2000 00:00:00 GMT" },
    );
  })
  .on("cycle", e => {
    console.log(e.target.toString());
  })
  .on("complete", function onComplete() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
