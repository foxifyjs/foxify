import { requestSettings } from "../../src";
import { inject, reset } from "../__internals__";

afterEach(reset);

describe("when X-Forwarded-Proto is missing", () => {
  it("should return false when http", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => res.end(req.secure ? "yes" : "no"),
      "/",
    );

    expect(result.body).toBe("no");
  });
});

describe("when X-Forwarded-Proto is present", () => {
  it("should return false when http", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => res.end(req.secure ? "yes" : "no"),
      {
        url    : "/",
        headers: {
          "x-forwarded-proto": "https",
        },
      },
    );

    expect(result.body).toBe("no");
  });

  it('should return true when "trust.proxy" is enabled', async () => {
    expect.assertions(1);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject(
      (req, res) => res.end(req.secure ? "yes" : "no"),
      {
        url    : "/",
        headers: {
          "x-forwarded-proto": "https",
        },
      },
    );

    expect(result.body).toBe("yes");
  });

  it("should return false when initial proxy is http", async () => {
    expect.assertions(1);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject(
      (req, res) => res.end(req.secure ? "yes" : "no"),
      {
        url    : "/",
        headers: {
          "x-forwarded-proto": "http, https",
        },
      },
    );

    expect(result.body).toBe("no");
  });

  it("should return true when initial proxy is https", async () => {
    expect.assertions(1);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject(
      (req, res) => res.end(req.secure ? "yes" : "no"),
      {
        url    : "/",
        headers: {
          "x-forwarded-proto": "https, http",
        },
      },
    );

    expect(result.body).toBe("yes");
  });

  describe("when 'trust.proxy' trusting hop count", () => {
    it("should respect X-Forwarded-Proto", async () => {
      expect.assertions(1);

      requestSettings({
        "trust.proxy": (ip, i) => i < 1,
      });

      const result = await inject(
        (req, res) => res.end(req.secure ? "yes" : "no"),
        {
          url    : "/",
          headers: {
            "x-forwarded-proto": "https",
          },
        },
      );

      expect(result.body).toBe("yes");
    });
  });
});
