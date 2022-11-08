import { inject, reset } from "../__internals__";

afterEach(reset);

it("should return false when the resource is not modified [GET]", async () => {
  expect.assertions(2);

  const etag = '"12345"';

  const result = await inject(
    (req, res) => {
      res.set("ETag", etag);

      res.send(res.stale);
    },
    {
      url    : "/",
      headers: {
        "if-none-match": etag,
      },
    },
  );

  expect(result.statusCode).toBe(304);
  expect(result.body).toBe("");
});

it("should return false when the resource is not modified [HEAD]", async () => {
  expect.assertions(2);

  const etag = '"12345"';

  const result = await inject(
    (req, res) => {
      res.set("ETag", etag);

      res.send(res.stale);
    },
    {
      url    : "/",
      method : "HEAD",
      headers: {
        "if-none-match": etag,
      },
    },
  );

  expect(result.statusCode).toBe(304);
  expect(result.body).toBe("");
});

it("should return true when the resource is modified", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => {
      res.set("ETag", '"123"');

      res.send(res.stale);
    },
    {
      url    : "/",
      headers: {
        "if-none-match": '"12345"',
      },
    },
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("true");
});

it("should return true without response headers", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => res.send(res.stale), "/");

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("true");
});

it("should return true [POST]", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => res.send(res.stale), {
    url   : "/",
    method: "POST",
  });

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("true");
});

it("should return false (304)", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.status(304).send(res.stale),
    "/",
  );

  expect(result.statusCode).toBe(304);
  expect(result.body).toBe("");
});

it("should return true (500)", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.status(500).send(res.stale),
    "/",
  );

  expect(result.statusCode).toBe(500);
  expect(result.body).toBe("true");
});
