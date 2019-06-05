import Foxify from "../../src";

it("should return the protocol string", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.use((req, res) => {
    res.end(req.protocol);
  });

  const result = await app.inject({
    url: "/",
  });

  expect(result.body).toBe("http");
});

describe("when 'trust.proxy' is enabled", () => {
  it("should respect X-Forwarded-Proto", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.set("trust.proxy", true);

    app.use((req, res) => {
      res.end(req.protocol);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("https");
  });

  it("should default to the socket addr if X-Forwarded-Proto not present", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.set("trust.proxy", true);

    app.use((req, res) => {
      (req.socket as any).encrypted = true;

      res.end(req.protocol);
    });

    const result = await app.inject({
      url: "/",
    });

    expect(result.body).toBe("https");
  });

  it("should ignore X-Forwarded-Proto if socket addr not trusted", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.set("trust.proxy", "10.0.0.1");

    app.use((req, res) => {
      res.end(req.protocol);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("http");
  });

  it("should default to http", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.set("trust.proxy", true);

    app.use((req, res) => {
      res.end(req.protocol);
    });

    const result = await app.inject({
      url: "/",
    });

    expect(result.body).toBe("http");
  });

  describe("when trusting hop count", () => {
    it("should respect X-Forwarded-Proto", async () => {
      expect.assertions(1);

      const app = new Foxify();

      app.set("trust.proxy", 1);

      app.use((req, res) => {
        res.end(req.protocol);
      });

      const result = await app.inject({
        url: "/",
        headers: {
          "x-forwarded-proto": "https",
        },
      });

      expect(result.body).toBe("https");
    });
  });
});

describe("when 'trust.proxy' is disabled", () => {
  it("should ignore X-Forwarded-Proto", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.protocol);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("http");
  });
});
