import Foxify from "../../src";

it("should return the Host when present", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.hostname);
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      host: "example.com",
    },
  });

  expect(result.body).toBe("example.com");
});

it("should strip port number", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.hostname);
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      host: "example.com:3000",
    },
  });

  expect(result.body).toBe("example.com");
});

it("should return undefined otherwise", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    // eslint-disable-next-line no-undefined
    req.headers.host = undefined;
    res.end(String(req.hostname));
  });

  const result = await app.inject("/");

  expect(result.body).toBe("undefined");
});

it("should work with IPv6 Host", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.hostname);
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      host: "[::1]",
    },
  });

  expect(result.body).toBe("[::1]");
});

it("should work with IPv6 Host and port", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.end(req.hostname);
  });

  const result = await app.inject({
    url    : "/",
    headers: {
      host: "[::1]:3000",
    },
  });

  expect(result.body).toBe("[::1]");
});

describe("When 'trust.proxy' is enabled", () => {
  it("should respect X-Forwarded-Host", async () => {
    expect.assertions(1);

    const app = (new Foxify);

    app.set("trust.proxy", true);

    app.get("/", (req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url    : "/",
      headers: {
        host              : "localhost",
        "x-forwarded-host": "example.com:3000",
      },
    });

    expect(result.body).toBe("example.com");
  });

  it("should ignore X-Forwarded-Host if socket addr not trusted", async () => {
    expect.assertions(1);

    const app = (new Foxify);

    app.set("trust.proxy", "10.0.0.1");

    app.get("/", (req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url    : "/",
      headers: {
        host              : "localhost",
        "x-forwarded-host": "example.com",
      },
    });

    expect(result.body).toBe("localhost");
  });

  it("should default to Host", async () => {
    expect.assertions(1);

    const app = (new Foxify);

    app.set("trust.proxy", true);

    app.get("/", (req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url    : "/",
      headers: {
        host: "example.com",
      },
    });

    expect(result.body).toBe("example.com");
  });

  describe("when multiple X-Forwarded-Host", () => {
    it("should use the first value", async () => {
      expect.assertions(2);

      const app = (new Foxify);

      app.set("trust.proxy", true);

      app.get("/", (req, res) => {
        res.send(req.hostname!);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          host              : "localhost",
          "x-forwarded-host": "example.com, foobar.com",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("example.com");
    });

    it("should remove OWS around comma", async () => {
      expect.assertions(2);

      const app = (new Foxify);

      app.set("trust.proxy", true);

      app.get("/", (req, res) => {
        res.send(req.hostname!);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          host              : "localhost",
          "x-forwarded-host": "example.com , foobar.com",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("example.com");
    });

    it("should strip port number", async () => {
      expect.assertions(2);

      const app = (new Foxify);

      app.set("trust.proxy", true);

      app.get("/", (req, res) => {
        res.send(req.hostname!);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          host              : "localhost",
          "x-forwarded-host": "example.com:8080 , foobar.com:8080",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("example.com");
    });
  });
});

describe("when 'trust.proxy' is disabled", () => {
  it("should ignore X-Forwarded-Host", async () => {
    expect.assertions(1);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url    : "/",
      headers: {
        host              : "localhost",
        "x-forwarded-host": "evil",
      },
    });

    expect(result.body).toBe("localhost");
  });
});
