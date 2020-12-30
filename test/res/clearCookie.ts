import Foxify from "../../src";

describe(".clearCookie(name)", () => {
  it("should set a cookie passed expiry", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.clearCookie("sid").end();
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toBe(
      "sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    );
  });
});

describe(".clearCookie(name, options)", () => {
  it("should set the given params", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.clearCookie("sid", { path: "/admin" }).end();
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toBe(
      "sid=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    );
  });
});
