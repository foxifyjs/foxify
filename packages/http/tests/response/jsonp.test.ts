import { responseSettings } from "../../src";
import { inject, reset } from "../__internals__";

afterEach(reset);

it("should respond with jsonp", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.jsonp({ count: 1 }),
    "/?callback=something",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/something\({"count":1}\);/);
});

it("should use first callback parameter with jsonp", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.jsonp({ count: 1 }),
    "/?callback=something&callback=somethingelse",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/something\({"count":1}\);/);
});

it("should ignore object callback parameter with jsonp", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.jsonp({ count: 1 }),
    "/?callback[a]=something",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
  expect(result.body).toBe('{"count":1}');
});

it("should allow renaming callback", async () => {
  expect.assertions(3);

  responseSettings({
    "jsonp.callback": "clb",
  });

  const result = await inject(
    (req, res) => res.jsonp({ count: 1 }),
    "/?clb=something",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/something\({"count":1}\);/);
});

it("should allow []", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.jsonp({ count: 1 }),
    "/?callback=callbacks[123]",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/callbacks\[123]\({"count":1}\);/);
});

it("should disallow arbitrary js", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.jsonp({}),
    "/?callback=foo;bar()",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/foobar\({}\);/);
});

it("should escape utf whitespace", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.jsonp({ str: "\u2028 \u2029 woot" }),
    "/?callback=foo",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.body).toMatch(/foo\({"str":"\\u2028 \\u2029 woot"}\);/);
});

it("should not escape utf whitespace for json fallback", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.jsonp({ str: "\u2028 \u2029 woot" }),
    "/",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
  expect(result.body).toBe('{"str":"\u2028 \u2029 woot"}');
});

it("should include security header and prologue", async () => {
  expect.assertions(4);

  const result = await inject(
    (req, res) => res.jsonp({ count: 1 }),
    "/?callback=something",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.headers["x-content-type-options"]).toBe("nosniff");
  expect(result.body).toMatch(/^\/\*\*\//);
});

it("should not override previous Content-Types with no callback", async () => {
  expect.assertions(4);

  const result = await inject(
    (req, res) => res.type("application/vnd.example+json").jsonp({ hello: "world" }),
    "/",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("application/vnd.example+json; charset=utf-8");
  expect(result.headers["x-content-type-options"]).toBeUndefined();
  expect(result.body).toBe('{"hello":"world"}');
});

it("should override previous Content-Types with callback", async () => {
  expect.assertions(4);

  const result = await inject(
    (req, res) => res.type("application/vnd.example+json").jsonp({ hello: "world" }),
    "/?callback=cb",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
  expect(result.headers["x-content-type-options"]).toBe("nosniff");
  expect(result.body).toMatch(/cb\({"hello":"world"}\);$/);
});

describe("when given primitives", () => {
  it("should respond with json for null", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.jsonp(null), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe("null");
  });

  it("should respond with json for Number", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.jsonp(300), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe("300");
  });

  it("should respond with json for String", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.jsonp("str"), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('"str"');
  });
});

describe("when given an array", () => {
  it("should respond with json", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.jsonp(["foo", "bar", "baz"]),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('["foo","bar","baz"]');
  });
});

describe("when given an object", () => {
  it("should respond with json", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.jsonp({ name: "tobi" }), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{"name":"tobi"}');
  });
});

describe('"json.escape" setting', () => {
  it("should unicode escape HTML-sniffing characters", async () => {
    expect.assertions(3);

    responseSettings({
      "json.escape": true,
    });

    const result = await inject(
      (req, res) => res.jsonp({ "&": "\u2028<script>\u2029" }),
      "/?callback=foo",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/javascript; charset=utf-8");
    expect(result.body).toMatch(/foo\({"\\u0026":"\\u2028\\u003cscript\\u003e\\u2029"}\)/);
  });
});

describe('"json.replacer" setting', () => {
  it("should be passed to JSON.stringify()", async () => {
    expect.assertions(3);

    responseSettings({
      // eslint-disable-next-line no-undefined
      "json.replacer": (key, val) => (key.startsWith("_") ? undefined : val),
    });

    const result = await inject(
      (req, res) => res.jsonp({
        name: "tobi",
        _id : 12345,
      }),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{"name":"tobi"}');
  });
});

describe('"json.spaces" setting', () => {
  it("should be passed to JSON.stringify()", async () => {
    expect.assertions(3);

    responseSettings({
      "json.spaces": 2,
    });

    const result = await inject(
      (req, res) => res.jsonp({
        name: "tobi",
        age : 2,
      }),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{\n  "name": "tobi",\n  "age": 2\n}');
  });
});
