import * as Foxify from "../../src";

it("should return an empty object", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.end(JSON.stringify(req.params));
  });

  const result = await app.inject("/");

  expect(result.body).toBe("{}");
});

it("should return the url params", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.get("/:foo", (req, res) => {
    res.end(req.params.foo);
  });

  const result = await app.inject("/bar");

  expect(result.body).toBe("bar");
});
