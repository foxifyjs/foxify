import { inject, reset } from "../__internals__";

afterEach(reset);

describe("when Accept-Charset is not present", () => {
  it("should return true", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => res.end(req.acceptsCharsets("utf-8") ? "yes" : "no"),
      "/",
    );

    expect(result.body).toBe("yes");
  });
});

describe("when Accept-Charset is not present", () => {
  it("should return true when present", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => res.end(req.acceptsCharsets("utf-8") ? "yes" : "no"),
      {
        url    : "/",
        headers: {
          "accept-charset": "foo, bar, utf-8",
        },
      },
    );

    expect(result.body).toBe("yes");
  });

  it("should return false otherwise", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => res.end(req.acceptsCharsets("utf-8") ? "yes" : "no"),
      {
        url    : "/",
        headers: {
          "accept-charset": "foo, bar",
        },
      },
    );

    expect(result.body).toBe("no");
  });
});
