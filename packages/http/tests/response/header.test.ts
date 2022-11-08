import { inject, reset } from "../__internals__";

afterEach(reset);

describe(".header(field, value)", () => {
  it("should set the response header field", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => res.header("Content-Type", "text/x-foo").end(),
      "/",
    );

    expect(result.headers["content-type"]).toBe("text/x-foo; charset=utf-8");
  });

  it("should coerce to a string", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => {
      res.header("X-Number", 123);

      res.end(typeof res.get("X-Number"));
    }, "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["x-number"]).toBe("123");
    expect(result.body).toBe("string");
  });
});

describe(".header(field, values)", () => {
  it("should set multiple response header fields", async () => {
    expect.assertions(1);

    const result = await inject((req, res) => {
      res.header("Set-Cookie", ["type=ninja", "language=javascript"]);

      res.send(res.get("Set-Cookie"));
    }, "/");

    expect(result.body).toBe('["type=ninja","language=javascript"]');
  });

  it("should coerce to an array of strings", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => {
      res.header("X-Numbers", [123, 456]);

      res.end(JSON.stringify(res.get("X-Numbers")));
    }, "/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('["123","456"]');
  });

  it("should not set a charset of one is already set", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => {
      res.header("Content-Type", "text/html; charset=lol");

      res.end();
    }, "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=lol");
  });
});

describe(".header(object)", () => {
  it("should set multiple fields", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res
        .header({
          "X-Foo": "bar",
          "X-Bar": "baz",
        })
        .end(),
      "/",
    );

    expect(result.headers["x-foo"]).toBe("bar");
    expect(result.headers["x-bar"]).toBe("baz");
  });

  it("should coerce to a string", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => {
      res.header({ "X-Number": 123 });

      res.end(typeof res.get("X-Number"));
    }, "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["x-number"]).toBe("123");
    expect(result.body).toBe("string");
  });
});
