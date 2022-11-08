import { inject, reset } from "../__internals__";

afterEach(reset);

describe(".clearCookie(name)", () => {
  it("should set a cookie passed expiry", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.clearCookie("sid").end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toBe("sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });
});

describe(".clearCookie(name, options)", () => {
  it("should set the given params", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.clearCookie("sid", { path: "/admin" }).end(),
      "/",
    );

    expect(result.statusCode).toBe(200);
    expect(result.headers["set-cookie"]).toBe("sid=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });
});
