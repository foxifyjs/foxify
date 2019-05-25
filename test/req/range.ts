import * as Foxify from "../../src";

describe(".range(size)", () => {
  it("should return parsed ranges", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.json(req.range(120) as any);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        range: "bytes=0-50,51-100",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[{\"start\":0,\"end\":50},{\"start\":51,\"end\":100}]");
  });

  it("should cap to the given size", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.json(req.range(75) as any);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        range: "bytes=0-100",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[{\"start\":0,\"end\":74}]");
  });

  it("should cap to the given size when open-ended", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.json(req.range(75) as any);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        range: "bytes=0-",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[{\"start\":0,\"end\":74}]");
  });

  it("should have a .type", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.send((req.range(120) as any).type);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        range: "bytes=0-100",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("bytes");
  });

  it("should accept any type", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.send((req.range(120) as any).type);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        range: "users=0-2",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("users");
  });

  it("should return undefined if no range", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.send(String(req.range(120) as any));
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("undefined");
  });
});

describe(".range(size, options)", () => {
  describe("with \"combine: true\" option", () => {
    it("should return combined ranges", async () => {
      expect.assertions(2);

      const app = new Foxify();

      app.use((req, res) => {
        res.json(req.range(120, true) as any);
      });

      const result = await app.inject({
        url: "/",
        headers: {
          range: "bytes=0-50,51-100",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual([{ start: 0, end: 100 }]);
    });
  });
});
