import assert from "assert";
import Foxify, { Router } from "../../src";

describe("with canonicalized mime types", () => {
  const app = new Foxify();

  app.use((req, res, next) => {
    res.format({
      "text/plain": () => {
        res.send("hey");
      },

      "text/html": () => {
        res.send("<p>hey</p>");
      },

      "application/json": (a, b, c) => {
        assert(req === a);
        assert(res === b);
        assert(next === c);
        res.send({ message: "hey" });
      },
    });
  });

  app.error((err: any, req, res) => {
    if (!err.types) throw err;

    res.status(err.status).send(`Supports: ${err.types.join(", ")}`);
  });

  test(app);
});

describe("with extnames", () => {
  const app = new Foxify();

  app.use((req, res) => {
    res.format({
      text: () => {
        res.send("hey");
      },
      html: () => {
        res.send("<p>hey</p>");
      },
      json: () => {
        res.send({ message: "hey" });
      },
    });
  });

  app.error((err: any, req, res) => {
    res.status(err.status).send(`Supports: ${err.types.join(", ")}`);
  });

  test(app);
});

describe("with parameters", () => {
  const app = new Foxify();

  app.use((req, res) => {
    res.format({
      "text/plain; charset=utf-8": () => {
        res.send("hey");
      },
      "text/html; foo=bar; bar=baz": () => {
        res.send("<p>hey</p>");
      },
      "application/json; q=0.5": () => {
        res.send({ message: "hey" });
      },
    });
  });

  app.error((err: any, req, res) => {
    res.status(err.status).send(`Supports: ${err.types.join(", ")}`);
  });

  test(app);
});

describe("given .default", () => {
  it("should be invoked instead of auto-responding", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.format({
        text: () => {
          res.send("hey");
        },
        default: () => {
          res.send("default");
        },
      });
    });

    const result = await app.inject({
      url: "/",
      headers: {
        accept: "text/html",
      },
    });

    expect(result.body).toBe("default");
  });

  it("should work when only .default is provided", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.format({
        default: () => {
          res.send("hey");
        },
      });
    });

    const result = await app.inject({
      url: "/",
      headers: {
        accept: "*/*",
      },
    });

    expect(result.body).toBe("hey");
  });
});

describe("in router", () => {
  const app = new Foxify();

  app.get("/", (req, res, next) => {
    res.format({
      text: () => {
        res.send("hey");
      },
      html: () => {
        res.send("<p>hey</p>");
      },
      json: () => {
        res.send({ message: "hey" });
      },
    });
  });

  app.error((err: any, req, res) => {
    res.status(err.status).send(`Supports: ${err.types.join(", ")}`);
  });

  test(app);
});

describe("in router", () => {
  const app = new Foxify();
  const router = new Router();

  router.get("/", (req, res) => {
    res.format({
      text: () => {
        res.send("hey");
      },
      html: () => {
        res.send("<p>hey</p>");
      },
      json: () => {
        res.send({ message: "hey" });
      },
    });
  });

  app.error((err: any, req, res) => {
    res.status(err.status).send(`Supports: ${err.types.join(", ")}`);
  });

  app.use(router);

  test(app);
});

function test(app: Foxify) {
  it("should utilize qvalues in negotiation", async () => {
    expect.assertions(1);

    const result = await app.inject({
      url: "/",
      headers: {
        accept: "text/html; q=.5, application/json, */*; q=.1",
      },
    });

    expect(JSON.parse(result.body)).toEqual({ message: "hey" });
  });

  it("should allow wildcard type/subtypes", async () => {
    expect.assertions(1);

    const result = await app.inject({
      url: "/",
      headers: {
        accept: "text/html; q=.5, application/*, */*; q=.1",
      },
    });

    expect(JSON.parse(result.body)).toEqual({ message: "hey" });
  });

  it("should default the Content-Type", async () => {
    expect.assertions(2);

    const result = await app.inject({
      url: "/",
      headers: {
        accept: "text/html; q=.5, text/plain",
      },
    });

    expect(result.headers["content-type"]).toBe("text/plain; charset=utf-8");
    expect(result.body).toBe("hey");
  });

  it("should set the correct charset for the Content-Type", async () => {
    expect.assertions(3);

    const result1 = await app.inject({
      url: "/",
      headers: {
        accept: "text/html",
      },
    });

    expect(result1.headers["content-type"]).toBe("text/html; charset=utf-8");

    const result2 = await app.inject({
      url: "/",
      headers: {
        accept: "text/plain",
      },
    });

    expect(result2.headers["content-type"]).toBe("text/plain; charset=utf-8");

    const result3 = await app.inject({
      url: "/",
      headers: {
        accept: "application/json",
      },
    });

    expect(result3.headers["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
  });

  it("should Vary: Accept", async () => {
    expect.assertions(1);

    const result1 = await app.inject({
      url: "/",
      headers: {
        accept: "text/html; q=.5, text/plain",
      },
    });

    expect(result1.headers.vary).toBe("Accept");
  });

  describe("when Accept is not present", () => {
    it("should invoke the first callback", async () => {
      expect.assertions(1);

      const result1 = await app.inject("/");

      expect(result1.body).toBe("hey");
    });
  });

  describe("when no match is made", () => {
    it("should should respond with 406 not acceptable", async () => {
      expect.assertions(2);

      const result1 = await app.inject({
        url: "/",
        headers: {
          accept: "foo/bar",
        },
      });

      expect(result1.statusCode).toBe(406);
      expect(result1.body).toBe(
        "Supports: text/plain, text/html, application/json",
      );
    });
  });
}
