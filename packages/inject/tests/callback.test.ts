import { IncomingMessage, ServerResponse } from "http";
import inject from "../src";

test("returns payload 1", () => {
  expect.assertions(5);

  const output = "example.com:8080|/hello";

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.statusMessage = "Super";
    res.setHeader("x-extra", "hello");
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": output.length,
    });
    res.end(`${req.headers.host}|${req.url}`);
  };

  inject(dispatch, "http://example.com:8080/hello", (err, res) => {
    expect(err).toBe(null);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe("Super");
    expect(res.headers).toEqual({
      "content-length": output.length,
      "content-type": "text/plain",
      "x-extra": "hello",
    });
    expect(res.body).toBe(output);
  });
});

test("returns payload 2", () => {
  expect.assertions(5);

  const output = "example.com:8080|/hello";

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": output.length,
    });
    res.end(`${req.headers.host}|${req.url}`);
  };

  const body = { hello: "world" };

  inject(
    dispatch,
    { body, url: "http://example.com:8080/hello", method: "POST" },
    (err, res) => {
      expect(err).toBe(null);
      expect(res.statusCode).toBe(200);
      expect(res.raw.req.method).toBe("POST");
      expect((res.raw.req as any)._inject.body).toBe(JSON.stringify(body));
      expect(res.body).toBe(output);
    },
  );
});

test("returns payload 3", () => {
  expect.assertions(5);

  const output = "example.com:443|/hello";

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": output.length,
    });
    res.end(`${req.headers.host}|${req.url}`);
  };

  const body = JSON.stringify({ hello: "world" });

  inject(
    dispatch,
    { body, url: "https://example.com/hello", method: "POST" },
    (err, res) => {
      expect(err).toBe(null);
      expect(res.statusCode).toBe(200);
      expect(res.raw.req.method).toBe("POST");
      expect((res.raw.req as any)._inject.body).toBe(body);
      expect(res.body).toBe(output);
    },
  );
});

test("returns payload 4", () => {
  expect.assertions(3);

  const output = "example.com:80|/hello";

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": output.length,
    });
    res.end(`${req.headers.host}|${req.url}`);
  };

  inject(dispatch, { url: "http://example.com/hello" }, (err, res) => {
    expect(err).toBe(null);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(output);
  });
});

test("returns payload 5", () => {
  expect.assertions(3);

  const output = "localhost:80|/hello";

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": output.length,
    });
    res.end(`${req.headers.host}|${req.url}`);
  };

  inject(dispatch, { url: "/hello" }, (err, res) => {
    expect(err).toBe(null);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(output);
  });
});

test("returns payload 6", () => {
  expect.assertions(2);

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.end();
  };

  inject(dispatch, "/", (err, res) => {
    expect(err).toBe(null);
    expect(res.body).toBe("");
  });
});

test("returns payload 7", done => {
  expect.assertions(4);

  const dispatch = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(201, { "Content-Type": req.headers["content-type"] });
    req.pipe(res);
  };

  const body = { hello: "world" };

  inject(dispatch, { body, method: "POST", url: "/hello" }, (err, res) => {
    expect(err).toBe(null);
    expect(res.statusCode).toBe(201);
    expect(res.headers["content-type"]).toBe("application/json");
    expect(res.body).toBe(JSON.stringify(body));
    done();
  });
});
