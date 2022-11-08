import { inject, reset } from "../__internals__";

afterEach(reset);

it("should set the Content-Type based on a filename", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.contentType("foo.js").end('var name = "tj";'),
    "/",
  );

  expect(result.headers["content-type"]).toBe("application/javascript; charset=utf-8");
});

it("should default to application/octet-stream", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.type("rawr").end('var name = "tj";'),
    "/",
  );

  expect(result.headers["content-type"]).toBe("application/octet-stream");
});

it("should set the Content-Type with type/subtype", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.type("application/vnd.amazon.ebook").end('var name = "tj";'),
    "/",
  );

  expect(result.headers["content-type"]).toBe("application/vnd.amazon.ebook");
});
