import { responseSettings } from "../../src";
import { inject, reset } from "../__internals__";

afterEach(reset);

it("should not support jsonp callbacks", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.json({ foo: "bar" }),
    "/?callback=foo",
  );

  expect(result.body).toBe('{"foo":"bar"}');
});

it("should not override previous Content-Types", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => res.type("application/vnd.example+json").json({ hello: "world" }),
    "/",
  );

  expect(result.statusCode).toBe(200);
  expect(result.headers["content-type"]).toBe("application/vnd.example+json; charset=utf-8");
  expect(result.body).toBe('{"hello":"world"}');
});

describe("when given primitives", () => {
  it("should respond with json for null", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.json(null), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe("null");
  });

  it("should respond with json for Number", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.json(300), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe("300");
  });

  it("should respond with json for String", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.json("str"), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('"str"');
  });
});

describe("when given an array", () => {
  it("should respond with json", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.json(["foo", "bar", "baz"]),
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

    const result = await inject((req, res) => res.json({ name: "tobi" }), "/");

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
      (req, res) => res.json({ "&": "<script>" }),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{"\\u0026":"\\u003cscript\\u003e"}');
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
      (req, res) => res.json({
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
      (req, res) => res.json({
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
