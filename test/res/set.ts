import Foxify from "../../src";

describe(".set(field, value)", () => {
  it("should set the response header field", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.set("Content-Type", "text/x-foo; charset=utf-8").end();
    });

    const result = await app.inject("/");

    expect(result.headers["content-type"]).toBe("text/x-foo; charset=utf-8");
  });

  it("should coerce to a string", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.use((req, res) => {
      res.set("X-Number", 123);
      res.end(typeof res.get("X-Number"));
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["x-number"]).toBe("123");
    expect(result.body).toBe("string");
  });
});

describe(".set(field, values)", () => {
  it("should set multiple response header fields", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.set("Set-Cookie", ["type=ninja", "language=javascript"]);
      res.send(res.get("Set-Cookie"));
    });

    const result = await app.inject("/");

    expect(result.body).toBe('["type=ninja","language=javascript"]');
  });

  it("should coerce to an array of strings", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.set("X-Numbers", [123, 456]);
      res.end(JSON.stringify(res.get("X-Numbers")));
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('["123","456"]');
  });

  it("should not set a charset of one is already set", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.set("Content-Type", "text/html; charset=lol");
      res.end();
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=lol");
  });

  it("should throw when Content-Type is an array", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.set("Content-Type", ["text/html"]);
      res.end();
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(500);
    expect(result.body).toMatch(/Content-Type cannot be set to an Array/);
  });
});

describe(".set(object)", () => {
  it("should set multiple fields", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res
        .set({
          "X-Foo": "bar",
          "X-Bar": "baz",
        })
        .end();
    });

    const result = await app.inject("/");

    expect(result.headers["x-foo"]).toBe("bar");
    expect(result.headers["x-bar"]).toBe("baz");
  });

  it("should coerce to a string", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.use((req, res) => {
      res.set({ "X-Number": 123 });
      res.end(typeof res.get("X-Number"));
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["x-number"]).toBe("123");
    expect(result.body).toBe("string");
  });
});
