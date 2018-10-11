import * as Foxify from "../../src";

describe(".hostname", () => {
  it("should return the Host when present", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "example.com",
      },
    });

    expect(result.body).toBe("example.com");
  });

  it("should strip port number", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "example.com:3000",
      },
    });

    expect(result.body).toBe("example.com");
  });

  it("should return undefined otherwise", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      req.headers.host = undefined;
      res.end(String(req.hostname));
    });

    const result = await app.inject("/");

    expect(result.body).toBe("undefined");
  });

  it("should work with IPv6 Host", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "[::1]",
      },
    });

    expect(result.body).toBe("[::1]");
  });

  it("should work with IPv6 Host and port", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "[::1]:3000",
      },
    });

    expect(result.body).toBe("[::1]");
  });

  it("should respect X-Forwarded-Host", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.hostname);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "host": "localhost",
        "x-forwarded-host": "example.com:3000",
      },
    });

    expect(result.body).toBe("example.com");
  });
});
