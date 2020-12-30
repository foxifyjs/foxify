import Foxify from "../../src";

it("should set the Content-Type based on a filename", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.type("foo.js").end('var name = "tj";');
  });

  const result = await app.inject("/");

  expect(result.headers["content-type"]).toBe(
    "application/javascript; charset=utf-8",
  );
});

it("should default to application/octet-stream", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.type("rawr").end('var name = "tj";');
  });

  const result = await app.inject("/");

  expect(result.headers["content-type"]).toBe("application/octet-stream");
});

it("should set the Content-Type with type/subtype", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.type("application/vnd.amazon.ebook").end('var name = "tj";');
  });

  const result = await app.inject("/");

  expect(result.headers["content-type"]).toBe("application/vnd.amazon.ebook");
});
