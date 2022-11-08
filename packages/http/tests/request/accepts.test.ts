import { inject, reset } from "../__internals__";

afterEach(reset);

it("should return true when Accept is not present", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("json") ? "yes" : "no"),
    "/",
  );

  expect(result.body).toBe("yes");
});

it("should return true when present", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("json") ? "yes" : "no"),
    {
      url    : "/",
      headers: {
        accept: "application/json",
      },
    },
  );

  expect(result.body).toBe("yes");
});

it("should return false otherwise", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("json") ? "yes" : "no"),
    {
      url    : "/",
      headers: {
        accept: "text/html",
      },
    },
  );

  expect(result.body).toBe("no");
});

it("should accept an argument list of type names", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("json", "html")),
    {
      url    : "/",
      headers: {
        accept: "application/json",
      },
    },
  );

  expect(result.body).toBe("json");
});

it("should return the first when Accept is not present", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("json", "html")),
    "/",
  );

  expect(result.body).toBe("json");
});

it("should return the first acceptable type", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("json", "html")),
    {
      url    : "/",
      headers: {
        accept: "text/html",
      },
    },
  );

  expect(result.body).toBe("html");
});

it("should return false when no match is made", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("text/html", "application/json") ? "yup" : "nope"),
    {
      url    : "/",
      headers: {
        accept: "foo/bar, bar/baz",
      },
    },
  );

  expect(result.body).toBe("nope");
});

it("should take quality into account", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("text/html", "application/json")),
    {
      url    : "/",
      headers: {
        accept: "*/html; q=.5, application/json",
      },
    },
  );

  expect(result.body).toBe("application/json");
});

it("should return the first acceptable type with canonical mime types", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.accepts("application/json", "text/html")),
    {
      url    : "/",
      headers: {
        accept: "*/html",
      },
    },
  );

  expect(result.body).toBe("text/html");
});
