import Foxify from "../../src";

it("should return true when X-Requested-With is xmlhttprequest", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.xhr).toBe(true);
    res.end();
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "x-requested-with": "xmlhttprequest",
    },
  });

  expect(result.statusCode).toBe(200);
});

it("should case-insensitive", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.xhr).toBe(true);
    res.end();
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
  });

  expect(result.statusCode).toBe(200);
});

it("should return false otherwise", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.xhr).toBe(false);
    res.end();
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "x-requested-with": "blahblah",
    },
  });

  expect(result.statusCode).toBe(200);
});

it("should return false when not present", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.xhr).toBe(false);
    res.end();
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
});
