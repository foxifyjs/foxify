import * as Foxify from "../../src";

it("should respond with jsonp", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({ count: 1 });
  });

  const result = await app.inject("/?callback=something");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/something\(\{"count":1\}\);/);
});

it("should use first callback parameter with jsonp", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({ count: 1 });
  });

  const result = await app.inject(
    "/?callback=something&callback=somethingelse",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/something\(\{"count":1\}\);/);
});

it("should ignore object callback parameter with jsonp", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({ count: 1 });
  });

  const result = await app.inject("/?callback[a]=something");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe(
    "application/json; charset=utf-8",
  );
  expect(result.body).toBe('{"count":1}');
});

it("should allow renaming callback", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.set("jsonp.callback", "clb");

  app.use((req, res) => {
    res.jsonp({ count: 1 });
  });

  const result = await app.inject("/?clb=something");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/something\(\{"count":1\}\);/);
});

it("should allow []", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({ count: 1 });
  });

  const result = await app.inject("/?callback=callbacks[123]");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/callbacks\[123\]\(\{"count":1\}\);/);
});

it("should disallow arbitrary js", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({});
  });

  const result = await app.inject("/?callback=foo;bar()");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/foobar\(\{\}\);/);
});

it("should escape utf whitespace", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({ str: "\u2028 \u2029 woot" });
  });

  const result = await app.inject("/?callback=foo");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/foo\(\{"str":"\\u2028 \\u2029 woot"\}\);/);
});

it("should not escape utf whitespace for json fallback", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({ str: "\u2028 \u2029 woot" });
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe(
    "application/json; charset=utf-8",
  );
  expect(result.body).toBe('{"str":"\u2028 \u2029 woot"}');
});

it("should include security header and prologue", async () => {
  expect.assertions(4);

  const app = new Foxify();

  app.use((req, res) => {
    res.jsonp({ count: 1 });
  });

  const result = await app.inject("/?callback=something");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.headers["x-content-type-options"]).toBe("nosniff");
  expect(result.body).toMatch(/^\/\*\*\//);
});

it("should not override previous Content-Types with no callback", async () => {
  expect.assertions(4);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.type("application/vnd.example+json");
    res.jsonp({ hello: "world" });
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe(
    "application/vnd.example+json; charset=utf-8",
  );
  expect(result.headers["x-content-type-options"]).toBeUndefined();
  expect(result.body).toBe('{"hello":"world"}');
});

it("should override previous Content-Types with callback", async () => {
  expect.assertions(4);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.type("application/vnd.example+json");
    res.jsonp({ hello: "world" });
  });

  const result = await app.inject("/?callback=cb");

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.headers["x-content-type-options"]).toBe("nosniff");
  expect(result.body).toMatch(/cb\(\{"hello":"world"\}\);$/);
});

describe("when given primitives", () => {
  it("should respond with json for null", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.use((req, res) => {
      res.jsonp(null);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    expect(result.body).toBe("null");
  });

  it("should respond with json for Number", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.use((req, res) => {
      res.jsonp(300);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    expect(result.body).toBe("300");
  });

  it("should respond with json for String", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.use((req, res) => {
      res.jsonp("str");
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    expect(result.body).toBe('"str"');
  });
});

describe("when given an array", () => {
  it("should respond with json", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.use((req, res) => {
      res.jsonp(["foo", "bar", "baz"]);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    expect(result.body).toBe('["foo","bar","baz"]');
  });
});

describe("when given an object", () => {
  it("should respond with json", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.use((req, res) => {
      res.jsonp({ name: "tobi" });
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    expect(result.body).toBe('{"name":"tobi"}');
  });
});

describe('"json.escape" setting', () => {
  it("should be undefined by default", () => {
    expect.assertions(1);

    const app = new Foxify();

    expect(app.disabled("json.escape")).toBe(true);
  });

  it("should unicode escape HTML-sniffing characters", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.enable("json.escape");

    app.use((req, res) => {
      res.jsonp({ "&": "\u2028<script>\u2029" });
    });

    const result = await app.inject("/?callback=foo");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "text/javascript; charset=utf-8",
    );
    expect(result.body).toMatch(
      /foo\({"\\u0026":"\\u2028\\u003cscript\\u003e\\u2029"}\)/,
    );
  });
});

describe('"json.replacer" setting', () => {
  it("should be passed to JSON.stringify()", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.set("json.replacer", (key: string, val: any) => {
      return key[0] === "_" ? undefined : val;
    });

    app.use((req, res) => {
      res.jsonp({ name: "tobi", _id: 12345 });
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    expect(result.body).toBe('{"name":"tobi"}');
  });
});

describe('"json.spaces" setting', () => {
  it("should be undefined by default", () => {
    expect.assertions(1);

    const app = new Foxify();

    expect(app.get("json.spaces")).toBeUndefined();
  });

  it("should be passed to JSON.stringify()", async () => {
    expect.assertions(3);

    const app = new Foxify();

    app.set("json.spaces", 2);

    app.use((req, res) => {
      res.jsonp({ name: "tobi", age: 2 });
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    expect(result.body).toBe('{\n  "name": "tobi",\n  "age": 2\n}');
  });
});
