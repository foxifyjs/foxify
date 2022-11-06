const { Suite } = require("benchmark");
const fresh = require("fresh");
const foxifyFresh = require("../.build/cjs").default;

new Suite()
  .add("fresh", () => {
    fresh({ "if-none-match": '"foo"' }, { etag: '"foo"' });
  })
  .add("@foxify/fresh", () => {
    foxifyFresh({ "if-none-match": '"foo"' }, { etag: '"foo"' });
  })
  .on("cycle", e => {
    console.log(e.target.toString());
  })
  .on("complete", function onComplete() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run({ async: true });
