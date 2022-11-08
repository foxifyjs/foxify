import { inject, reset } from "../__internals__";

afterEach(reset);

it("should append multiple headers", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res
      .append("Link", "<http://localhost/>")
      .append("Link", "<http://localhost:80/>")
      .end(),
    "/",
  );

  expect(result.headers.link).toEqual([
    "<http://localhost/>",
    "<http://localhost:80/>",
  ]);
});

it("should accept array of values", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.append("Set-Cookie", ["foo=bar", "fizz=buzz"]).end(),
    "/",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["set-cookie"]).toEqual(["foo=bar", "fizz=buzz"]);
});

it("should get reset by res.set(field, val)", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res
      .append("Link", "<http://localhost/>")
      .append("Link", "<http://localhost:80/>")
      .set("Link", "<http://127.0.0.1/>")
      .end(),
    "/",
  );

  expect(result.headers.link).toBe("<http://127.0.0.1/>");
});

it("should work with res.set(field, val) first", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res
      .set("Link", "<http://localhost/>")
      .append("Link", "<http://localhost:80/>")
      .end(),
    "/",
  );

  expect(result.headers.link).toEqual([
    "<http://localhost/>",
    "<http://localhost:80/>",
  ]);
});

it("should work with cookies", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res
      .cookie("foo", "bar")
      .append("Set-Cookie", ["bar=baz", "fizz=buzz"])
      .end(),
    "/",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["set-cookie"]).toEqual([
    "foo=bar; Path=/",
    "bar=baz",
    "fizz=buzz",
  ]);
});
