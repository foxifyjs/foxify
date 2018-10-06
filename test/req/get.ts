import * as Foxify from "../../src";

describe(".get(field)", () => {
  it("should return the header field value", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      expect(req.get("Something-Else")).toBeUndefined();
      res.end(req.get("Content-Type"));
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.body).toBe("application/json");
  });

  it("should special-case Referer", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.get("Referer"));
    });

    const result = await app.inject({
      url: "/",
      headers: {
        referer: "http://foobar.com",
      },
    });

    expect(result.body).toBe("http://foobar.com");
  });

  it("should throw missing header name", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.end((req as any).get());
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(500);
    expect(result.body).toMatch(/name argument is required to req\.get/);
  });

  it("should throw for non-string header name", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.get(42 as any));
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(500);
    expect(result.body).toMatch(/name must be a string to req\.get/);
  });
});
