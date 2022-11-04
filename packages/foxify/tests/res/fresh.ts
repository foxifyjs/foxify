import Foxify from "../../src";

it("should return true when the resource is not modified", async () => {
  expect.assertions(2);

  const app = (new Foxify);

  const etag = '"12345"';

  app.get("/", (req, res) => {
    res.set("ETag", etag);

    res.send(res.fresh);
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      "if-none-match": etag,
    },
  });

  expect(result.statusCode).toBe(304);
  expect(result.body).toBe("");
});

it("should return false when the resource is modified", async () => {
  expect.assertions(2);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.set("ETag", '"123"');

    res.send(res.fresh);
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      "if-none-match": '"12345"',
    },
  });

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});

it("should return false without response headers", async () => {
  expect.assertions(2);

  const app = (new Foxify);

  app.disable("x-powered-by");

  app.get("/", (req, res) => {
    res.send(res.fresh);
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});
