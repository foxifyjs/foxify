import Foxify from "../../src";

it("should return true when Accept is not present", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("json") ? "yes" : "no");
  });

  const result = await app.inject("/");

  expect(result.body).toBe("yes");
});

it("should return true when present", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("json") ? "yes" : "no");
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      accept: "application/json",
    },
  });

  expect(result.body).toBe("yes");
});

it("should return false otherwise", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("json") ? "yes" : "no");
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      accept: "text/html",
    },
  });

  expect(result.body).toBe("no");
});

it("should accept an argument list of type names", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("json", "html"));
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      accept: "application/json",
    },
  });

  expect(result.body).toBe("json");
});

it("should return the first when Accept is not present", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("json", "html"));
  });

  const result = await app.inject("/");

  expect(result.body).toBe("json");
});

it("should return the first acceptable type", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("json", "html"));
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      accept: "text/html",
    },
  });

  expect(result.body).toBe("html");
});

it("should return false when no match is made", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("text/html", "application/json") ? "yup" : "nope");
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      accept: "foo/bar, bar/baz",
    },
  });

  expect(result.body).toBe("nope");
});

it("should take quality into account", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("text/html", "application/json"));
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      accept: "*/html; q=.5, application/json",
    },
  });

  expect(result.body).toBe("application/json");
});

it("should return the first acceptable type with canonical mime types", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.accepts("application/json", "text/html"));
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      accept: "*/html",
    },
  });

  expect(result.body).toBe("text/html");
});
