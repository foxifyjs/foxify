// eslint-disable-next-line @typescript-eslint/no-require-imports
import assert = require("assert");
import { DispatchT } from "@foxify/inject";
import { Request, Response } from "../../src";
import { inject, reset } from "../__internals__";

function test(dispatch: DispatchT<Request, Response>): void {
  it("should utilize qvalues in negotiation", async () => {
    expect.assertions(1);

    const result = await inject(dispatch, {
      url    : "/",
      headers: {
        accept: "text/html; q=.5, application/json, */*; q=.1",
      },
    });

    expect(JSON.parse(result.body)).toEqual({ message: "hey" });
  });

  it("should allow wildcard type/subtypes", async () => {
    expect.assertions(1);

    const result = await inject(dispatch, {
      url    : "/",
      headers: {
        accept: "text/html; q=.5, application/*, */*; q=.1",
      },
    });

    expect(JSON.parse(result.body)).toEqual({ message: "hey" });
  });

  it("should default the Content-Type", async () => {
    expect.assertions(2);

    const result = await inject(dispatch, {
      url    : "/",
      headers: {
        accept: "text/html; q=.5, text/plain",
      },
    });

    expect(result.headers["content-type"]).toBe("text/plain; charset=utf-8");
    expect(result.body).toBe("hey");
  });

  it("should set the correct charset for the Content-Type", async () => {
    expect.assertions(3);

    const result1 = await inject(dispatch, {
      url    : "/",
      headers: {
        accept: "text/html",
      },
    });

    expect(result1.headers["content-type"]).toBe("text/html; charset=utf-8");

    const result2 = await inject(dispatch, {
      url    : "/",
      headers: {
        accept: "text/plain",
      },
    });

    expect(result2.headers["content-type"]).toBe("text/plain; charset=utf-8");

    const result3 = await inject(dispatch, {
      url    : "/",
      headers: {
        accept: "application/json",
      },
    });

    expect(result3.headers["content-type"]).toBe("application/json; charset=utf-8");
  });

  it("should Vary: Accept", async () => {
    expect.assertions(1);

    const result = await inject(dispatch, {
      url    : "/",
      headers: {
        accept: "text/html; q=.5, text/plain",
      },
    });

    expect(result.headers.vary).toBe("Accept");
  });

  describe("when Accept is not present", () => {
    it("should invoke the first callback", async () => {
      expect.assertions(1);

      const result = await inject(dispatch, "/");

      expect(result.body).toBe("hey");
    });
  });

  describe("when no match is made", () => {
    it("should should respond with 406 not acceptable", async () => {
      expect.assertions(2);

      const result = await inject(dispatch, {
        url    : "/",
        headers: {
          accept: "foo/bar",
        },
      });

      expect(result.statusCode).toBe(406);
      expect(result.body).toBe("Supports: text/plain, text/html, application/json");
    });
  });
}

afterEach(reset);

describe("with canonicalized mime types", () => {
  test((req, res) => {
    try {
      res.format({
        "text/plain": () => {
          res.send("hey");
        },

        "text/html": () => {
          res.send("<p>hey</p>");
        },

        "application/json": (a, b) => {
          assert(req === a);
          assert(res === b);
          res.send({ message: "hey" });
        },
      });
    } catch (err: any) {
      if (!err.types) throw err;

      res.status(err.status).send(`Supports: ${ err.types.join(", ") }`);
    }
  });
});

describe("with extnames", () => {
  test((req, res) => {
    try {
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
    } catch (err: any) {
      res.status(err.status).send(`Supports: ${ err.types.join(", ") }`);
    }
  });
});

describe("with parameters", () => {
  test((req, res) => {
    try {
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
    } catch (err: any) {
      res.status(err.status).send(`Supports: ${ err.types.join(", ") }`);
    }
  });
});

describe("given .default", () => {
  it("should be invoked instead of auto-responding", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => {
        res.format({
          text: () => {
            res.send("hey");
          },
          default: () => {
            res.send("default");
          },
        });
      },
      {
        url    : "/",
        headers: {
          accept: "text/html",
        },
      },
    );

    expect(result.body).toBe("default");
  });

  it("should work when only .default is provided", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => {
        res.format({
          default: () => {
            res.send("hey");
          },
        });
      },
      {
        url    : "/",
        headers: {
          accept: "*/*",
        },
      },
    );

    expect(result.body).toBe("hey");
  });
});
