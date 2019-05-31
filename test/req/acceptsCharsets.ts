import * as Foxify from "../../src";

describe("when Accept-Charset is not present", () => {
  it("should return true", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.acceptsCharsets("utf-8") ? "yes" : "no");
    });

    const result = await app.inject("/");

    expect(result.body).toBe("yes");
  });
});

describe("when Accept-Charset is not present", () => {
  it("should return true when present", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.acceptsCharsets("utf-8") ? "yes" : "no");
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "accept-charset": "foo, bar, utf-8",
      },
    });

    expect(result.body).toBe("yes");
  });

  it("should return false otherwise", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.use((req, res) => {
      res.end(req.acceptsCharsets("utf-8") ? "yes" : "no");
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "accept-charset": "foo, bar",
      },
    });

    expect(result.body).toBe("no");
  });
});
