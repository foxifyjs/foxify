import Foxify from "../../src";

it("should not support jsonp callbacks", async () => {
  expect.assertions(1);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.json({ foo: "bar" });
  });

  const result = await app.inject("/?callback=foo");

  expect(result.body).toBe('{"foo":"bar"}');
});

it("should not override previous Content-Types", async () => {
  expect.assertions(3);

  const app = (new Foxify);

  app.get("/", (req, res) => {
    res.type("application/vnd.example+json");
    res.json({ hello: "world" });
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("application/vnd.example+json; charset=utf-8");
  expect(result.body).toBe('{"hello":"world"}');
});

describe("when given primitives", () => {
  it("should respond with json for null", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.json(null);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe("null");
  });

  it("should respond with json for Number", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.json(300);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe("300");
  });

  it("should respond with json for String", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.json("str");
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('"str"');
  });
});

describe("when given an array", () => {
  it("should respond with json", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.json(["foo", "bar", "baz"]);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('["foo","bar","baz"]');
  });
});

describe("when given an object", () => {
  it("should respond with json", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.json({ name: "tobi" });
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{"name":"tobi"}');
  });
});

describe('"json.escape" setting', () => {
  it("should be disabled by default", () => {
    expect.assertions(1);

    const app = (new Foxify);

    expect(app.enabled("json.escape")).toBe(false);
  });

  it("should unicode escape HTML-sniffing characters", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    app.enable("json.escape");

    app.get("/", (req, res) => {
      res.json({ "&": "<script>" });
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{"\\u0026":"\\u003cscript\\u003e"}');
  });
});

describe('"json.replacer" setting', () => {
  it("should be passed to JSON.stringify()", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    // eslint-disable-next-line no-undefined
    app.set("json.replacer", (key: string, val: any) => (key.startsWith("_") ? undefined : val));

    app.get("/", (req, res) => {
      res.json({
        name: "tobi",
        _id : 12345,
      });
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{"name":"tobi"}');
  });
});

describe('"json.spaces" setting', () => {
  it("should be undefined by default", () => {
    expect.assertions(1);

    const app = (new Foxify);

    expect(app.setting("json.spaces")).toBeUndefined();
  });

  it("should be passed to JSON.stringify()", async () => {
    expect.assertions(3);

    const app = (new Foxify);

    app.set("json.spaces", 2);

    app.get("/", (req, res) => {
      res.json({
        name: "tobi",
        age : 2,
      });
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{\n  "name": "tobi",\n  "age": 2\n}');
  });
});
