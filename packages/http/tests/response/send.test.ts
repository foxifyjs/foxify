import { METHODS, responseSettings } from "../../src";
import { createETagGenerator } from "../../src/utils";
import { inject, reset } from "../__internals__";

afterEach(reset);

describe(".send()", () => {
  it('should set body to ""', async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.send(), "/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("");
  });
});

describe(".send(null)", () => {
  it('should set body to ""', async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.send(null), "/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("");
  });
});

describe(".send(undefined)", () => {
  it('should set body to ""', async () => {
    expect.assertions(2);

    // eslint-disable-next-line no-undefined
    const result = await inject((req, res) => res.send(undefined), "/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("");
  });
});

describe(".send(String)", () => {
  it("should send as html", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.send("<p>hey</p>"), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=utf-8");
    expect(result.body).toBe("<p>hey</p>");
  });

  it("should set ETag", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => {
      const str = Array(1000).join("-");

      res.send(str);
    }, "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers.etag).toBe('W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"');
  });

  it("should not override Content-Type", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.set("Content-Type", "text/plain").send("hey"),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/plain; charset=utf-8");
    expect(result.body).toBe("hey");
  });

  it("should override charset in Content-Type", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.set("Content-Type", "text/plain; charset=iso-8859-1").send("hey"),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/plain; charset=utf-8");
    expect(result.body).toBe("hey");
  });

  it("should keep charset in Content-Type for Buffers", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res
        .set("Content-Type", "text/plain; charset=iso-8859-1")
        .send(Buffer.from("hi")),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/plain; charset=iso-8859-1");
    expect(result.body).toBe("hi");
  });
});

describe(".send(Buffer)", () => {
  it("should send as octet-stream", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.send(Buffer.from("hello")),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/octet-stream");
    expect(result.body).toBe("hello");
  });

  it("should set ETag", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.send(Buffer.alloc(999, "-")),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers.etag).toBe('W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"');
  });

  it("should not override Content-Type", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.set("Content-Type", "text/plain").send(Buffer.from("hey")),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("text/plain; charset=utf-8");
    expect(result.body).toBe("hey");
  });

  it("should not override ETag", async () => {
    expect.assertions(3);

    const result = await inject(
      (req, res) => res.type("text/plain").set("ETag", '"foo"')
        .send(Buffer.from("hey")),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers.etag).toBe('"foo"');
    expect(result.body).toBe("hey");
  });
});

describe(".send(Object)", () => {
  it("should send as application/json", async () => {
    expect.assertions(3);

    const result = await inject((req, res) => res.send({ name: "tobi" }), "/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(result.body).toBe('{"name":"tobi"}');
  });
});

describe("when the request method is HEAD", () => {
  it("should ignore the body", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.send("yay"), {
      url   : "/",
      method: "HEAD",
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("");
  });
});

describe("when .statusCode is 204", () => {
  it("should strip Content-* fields, Transfer-Encoding field, and body", async () => {
    expect.assertions(5);

    const result = await inject(
      (req, res) => res.status(204).set("Transfer-Encoding", "chunked")
        .send("foo"),
      "/",
    );

    expect(result.statusCode).toBe(204);
    expect(result.headers["content-type"]).toBeUndefined();
    expect(result.headers["content-length"]).toBeUndefined();
    expect(result.headers["transfer-encoding"]).toBeUndefined();
    expect(result.body).toBe("");
  });
});

describe("when .statusCode is 304", () => {
  it("should strip Content-* fields, Transfer-Encoding field, and body", async () => {
    expect.assertions(5);

    const result = await inject(
      (req, res) => res.status(304).set("Transfer-Encoding", "chunked")
        .send("foo"),
      "/",
    );

    expect(result.statusCode).toBe(304);
    expect(result.headers["content-type"]).toBeUndefined();
    expect(result.headers["content-length"]).toBeUndefined();
    expect(result.headers["transfer-encoding"]).toBeUndefined();
    expect(result.body).toBe("");
  });
});

it("should always check regardless of length", async () => {
  expect.assertions(1);

  const etag = '"asdf"';

  const result = await inject((req, res) => res.set("ETag", etag).send("hey"), {
    url    : "/",
    headers: {
      "if-none-match": etag,
    },
  });

  expect(result.statusCode).toBe(304);
});

it("should respond with 304 Not Modified when fresh", async () => {
  expect.assertions(1);

  const etag = '"asdf"';

  const result = await inject(
    (req, res) => {
      const str = Array(1000).join("-");

      res.set("ETag", etag);
      res.send(str);
    },
    {
      url    : "/",
      headers: {
        "if-none-match": etag,
      },
    },
  );

  expect(result.statusCode).toBe(304);
});

it("should not perform freshness check unless 2xx or 304", async () => {
  expect.assertions(2);

  const etag = '"asdf"';

  const result = await inject(
    (req, res) => res.status(500).set("ETag", etag)
      .send("hey"),
    {
      url    : "/",
      headers: {
        "if-none-match": etag,
      },
    },
  );

  expect(result.statusCode).toBe(500);
  expect(result.body).toBe("hey");
});

it("should not support jsonp callbacks", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.send({ foo: "bar" }),
    "/?callback=foo",
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe('{"foo":"bar"}');
});

it("should be chainable", async () => {
  expect.assertions(3);

  const result = await inject((req, res) => {
    expect(res.send("hey")).toEqual(res);
  }, "/?callback=foo");

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("hey");
});

describe('"etag" setting', () => {
  describe("when enabled", () => {
    it("should send ETag", async () => {
      expect.assertions(2);

      responseSettings({
        etag: createETagGenerator(true),
      });

      const result = await inject((req, res) => res.send("kajdslfkasdf"), "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"');
    });

    METHODS.forEach((method) => {
      if (method.toLowerCase() === "connect") return;

      it(`should send ETag in response to ${ method } request`, async () => {
        expect.assertions(2);

        const result = await inject((req, res) => res.send("kajdslfkasdf"), {
          url: "/",
          method,
        });

        expect(result.statusCode).toBe(200);
        expect(result.headers.etag).toBe('W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"');
      });
    });

    it("should send ETag for empty string response", async () => {
      expect.assertions(2);

      responseSettings({
        etag: createETagGenerator(true),
      });

      const result = await inject((req, res) => res.send(""), "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
    });

    it("should send ETag for long response", async () => {
      expect.assertions(2);

      responseSettings({
        etag: createETagGenerator(true),
      });

      const result = await inject((req, res) => {
        const str = Array(1000).join("-");

        res.send(str);
      }, "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"');
    });

    it("should not override ETag when manually set", async () => {
      expect.assertions(2);

      responseSettings({
        etag: createETagGenerator(true),
      });

      const result = await inject((req, res) => {
        res.set("etag", '"asdf"');

        res.send(200);
      }, "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('"asdf"');
    });

    it("should not send ETag for res.send()", async () => {
      expect.assertions(2);

      responseSettings({
        etag: createETagGenerator(true),
      });

      const result = await inject((req, res) => res.send(), "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBeUndefined();
    });
  });

  describe("when disabled", () => {
    it("should send no ETag", async () => {
      expect.assertions(2);

      responseSettings({
        // eslint-disable-next-line no-undefined
        etag: undefined,
      });

      const result = await inject((req, res) => {
        const str = Array(1000).join("-");

        res.send(str);
      }, "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBeUndefined();
    });

    it("should send ETag when manually set", async () => {
      expect.assertions(2);

      responseSettings({
        // eslint-disable-next-line no-undefined
        etag: undefined,
      });

      const result = await inject((req, res) => {
        res.set("etag", '"asdf"');

        res.send(200);
      }, "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('"asdf"');
    });
  });

  describe('when "strong"', () => {
    it("should send strong ETag", async () => {
      expect.assertions(2);

      responseSettings({
        etag: createETagGenerator(false),
      });

      const result = await inject((req, res) => res.send("hello, world!"), "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('"d-HwnTDHB9U/PRbFMN1z1wps51lqk"');
    });
  });

  describe('when "weak"', () => {
    it("should send weak ETag", async () => {
      expect.assertions(2);

      responseSettings({
        etag: createETagGenerator(true),
      });

      const result = await inject((req, res) => res.send("hello, world!"), "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('W/"d-HwnTDHB9U/PRbFMN1z1wps51lqk"');
    });
  });

  describe("when a function", () => {
    it("should send custom ETag", async () => {
      expect.assertions(3);

      responseSettings({
        etag: (body, encoding) => {
          const chunk = Buffer.isBuffer(body)
            ? body
            : Buffer.from(body, encoding);

          expect(chunk.toString()).toBe("hello, world!");

          return '"custom"';
        },
      });

      const result = await inject((req, res) => res.send("hello, world!"), "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBe('"custom"');
    });

    it("should not send falsy ETag", async () => {
      expect.assertions(2);

      responseSettings({
        // eslint-disable-next-line no-undefined
        etag: () => undefined,
      });

      const result = await inject((req, res) => res.send("hello, world!"), "/");

      expect(result.statusCode).toBe(200);
      expect(result.headers.etag).toBeUndefined();
    });
  });
});
