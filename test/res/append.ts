import Foxify from "../../src";

it("should append multiple headers", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.use((req, res, next) => {
    res.append("Link", "<http://localhost/>");
    next();
  });

  app.use((req, res) => {
    res.append("Link", "<http://localhost:80/>");
    res.end();
  });

  const result = await app.inject("/");

  expect(result.headers.link).toEqual([
    "<http://localhost/>",
    "<http://localhost:80/>",
  ]);
});

it("should accept array of values", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res, next) => {
    res.append("Set-Cookie", ["foo=bar", "fizz=buzz"]);
    res.end();
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers["set-cookie"]).toEqual(["foo=bar", "fizz=buzz"]);
});

it("should get reset by res.set(field, val)", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.use((req, res, next) => {
    res.append("Link", "<http://localhost/>");
    res.append("Link", "<http://localhost:80/>");
    next();
  });

  app.use((req, res) => {
    res.set("Link", "<http://127.0.0.1/>");
    res.end();
  });

  const result = await app.inject("/");

  expect(result.headers.link).toBe("<http://127.0.0.1/>");
});

it("should work with res.set(field, val) first", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.use((req, res, next) => {
    res.set("Link", "<http://localhost/>");
    next();
  });

  app.use((req, res) => {
    res.append("Link", "<http://localhost:80/>");
    res.end();
  });

  const result = await app.inject("/");

  expect(result.headers.link).toEqual([
    "<http://localhost/>",
    "<http://localhost:80/>",
  ]);
});

it("should work with cookies", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res, next) => {
    res.cookie("foo", "bar");
    next();
  });

  app.use((req, res) => {
    res.append("Set-Cookie", ["bar=baz", "fizz=buzz"]);
    res.end();
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers["set-cookie"]).toEqual([
    "foo=bar; Path=/",
    "bar=baz",
    "fizz=buzz",
  ]);
});
