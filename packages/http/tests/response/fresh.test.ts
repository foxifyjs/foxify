import { inject, reset } from "../__internals__";

afterEach(reset);

it("should return true when the resource is not modified [GET]", async () => {
  expect.assertions(2);

  const etag = '"12345"';

  const result = await inject(
    (req, res) => {
      res.set("ETag", etag);

      res.send(res.fresh);
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

it("should return true when the resource is not modified [HEAD]", async () => {
  expect.assertions(2);

  const etag = '"12345"';

  const result = await inject(
    (req, res) => {
      res.set("ETag", etag);

      res.send(res.fresh);
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

it("should return false when the resource is modified", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => {
      res.set("ETag", '"123"');

      res.send(res.fresh);
    },
    {
      url    : "/",
      headers: {
        "if-none-match": '"12345"',
      },
    },
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});

it("should return false without response headers", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => res.send(res.fresh), "/");

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});

it("should return false [POST]", async () => {
  expect.assertions(2);

  const result = await inject((req, res) => res.send(res.fresh), {
    url   : "/",
    method: "POST",
  });

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});

it("should return true (304)", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.status(304).send(res.fresh),
    "/",
  );

  expect(result.statusCode).toBe(304);
  expect(result.body).toBe("");
});

it("should return false (500)", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.status(500).send(res.fresh),
    "/",
  );

  expect(result.statusCode).toBe(500);
  expect(result.body).toBe("false");
});
