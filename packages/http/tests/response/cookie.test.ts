import * as cookie from "cookie";
import cookieParser from "cookie-parser";
import { inject, reset } from "../__internals__";

afterEach(reset);

describe(".cookie(name, object)", () => {
  it("should generate a JSON cookie", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.cookie("user", { name: "tobi" }).end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toBe("user=j%3A%7B%22name%22%3A%22tobi%22%7D; Path=/");
  });
});

describe(".cookie(name, string)", () => {
  it("should set a cookie", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.cookie("name", "tobi").end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toBe("name=tobi; Path=/");
  });

  it("should allow multiple calls", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.cookie("name", "tobi").cookie("age", 1)
        .cookie("gender", "?")
        .end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toEqual([
      "name=tobi; Path=/",
      "age=1; Path=/",
      "gender=%3F; Path=/",
    ]);
  });
});

describe(".cookie(name, string, options)", () => {
  it("should set params", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.cookie("name", "tobi", {
        httpOnly: true,
        secure  : true,
      }).end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toBe("name=tobi; Path=/; HttpOnly; Secure");
  });

  describe("maxAge", () => {
    it("should set relative expires", async () => {
      expect.assertions(2);

      const result = await inject(
        (req, res) => res.cookie("name", "tobi", { maxAge: 1000 }).end(),
        "/",
      );

      expect(result.statusCode).toBe(200);
      expect((result.headers["set-cookie"] as any)[0]).not.toBe("Thu, 01 Jan 1970 00:00:01 GMT");
    });

    it("should set max-age", async () => {
      expect.assertions(1);

      const result = await inject(
        (req, res) => res.cookie("name", "tobi", { maxAge: 1000 }).end(),
        "/",
      );

      expect(result.headers["set-cookie"]).toMatch(/Max-Age=1/);
    });

    it("should not mutate the options object", async () => {
      expect.assertions(2);

      const options = { maxAge: 1000 };
      const optionsCopy = { ...options };

      const result = await inject(
        (req, res) => res.cookie("name", "tobi", options).json(options),
        "/",
      );

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual(optionsCopy);
    });
  });

  describe("signed", () => {
    it("should generate a signed JSON cookie", async () => {
      expect.assertions(2);

      const result = await inject(
        (req, res) => cookieParser("foo bar baz")(
          req as any,
          res as any,
          () => res.cookie("user", { name: "tobi" }, { signed: true }).end(),
        ),
        "/",
      );

      expect(result.statusCode).toBe(200);
      expect(cookie.parse((result.headers["set-cookie"] as any).split(".")[0]).user).toBe('s:j:{"name":"tobi"}');
    });
  });

  describe(".signedCookie(name, string)", () => {
    it("should set a signed cookie", async () => {
      expect.assertions(2);

      const result = await inject(
        (req, res) => cookieParser("foo bar baz")(
          req as any,
          res as any,
          () => res.cookie("name", "tobi", { signed: true }).end(),
        ),
        "/",
      );

      expect(result.statusCode).toBe(200);
      expect(result.headers["set-cookie"]).toBe("name=s%3Atobi.xJjV2iZ6EI7C8E5kzwbfA9PVLl1ZR07UTnuTgQQ4EnQ; Path=/");
    });
  });
});
