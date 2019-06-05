import Foxify from "../../src";

it("should return the header field value", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.get("Something-Else")).toBeUndefined();
    res.end(req.get("Content-Type"));
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "content-type": "application/json",
    },
  });

  expect(result.body).toBe("application/json");
});

it("should special-case Referer", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    res.end(req.get("Referer"));
  });

  const referer = "https://foxify.js.org";

  let result = await app.inject({
    url: "/",
    headers: {
      referer,
    },
  });

  expect(result.body).toBe(referer);

  result = await app.inject({
    url: "/",
    headers: {
      referrer: referer,
    },
  });

  expect(result.body).toBe(referer);
});

it("should special-case Referrer", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    res.end(req.get("Referrer"));
  });

  const referer = "https://foxify.js.org";

  let result = await app.inject({
    url: "/",
    headers: {
      referer,
    },
  });

  expect(result.body).toBe(referer);

  result = await app.inject({
    url: "/",
    headers: {
      referrer: referer,
    },
  });

  expect(result.body).toBe(referer);
});

it("should throw missing header name", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    res.end((req as any).get());
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(500);
  expect(JSON.parse(result.body)).toEqual({
    message: "Expected 'name' to be an string, got 'undefined' instead",
  });
});

it("should throw for non-string header name", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    res.end(req.get(42 as any));
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(500);
  expect(JSON.parse(result.body)).toEqual({
    message: "Expected 'name' to be an string, got 'number' instead",
  });
});
