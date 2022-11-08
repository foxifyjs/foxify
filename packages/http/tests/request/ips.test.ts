import { requestSettings } from "../../src";
import { inject, reset } from "../__internals__";

afterEach(reset);

describe("when X-Forwarded-For is present", () => {
  describe("when 'trust.proxy' is enabled", () => {
    it("should return an array of the specified addresses", async () => {
      expect.assertions(1);

      requestSettings({
        "trust.proxy": () => true,
      });

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.ips)),
        {
          url    : "/",
          headers: {
            "x-forwarded-for": "client, p1, p2",
          },
        },
      );

      expect(JSON.parse(result.body)).toEqual(["client", "p1", "p2"]);
    });

    it("should stop at first untrusted", async () => {
      expect.assertions(1);

      requestSettings({
        "trust.proxy": (ip, i) => i < 2,
      });

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.ips)),
        {
          url    : "/",
          headers: {
            "x-forwarded-for": "client, p1, p2",
          },
        },
      );

      expect(JSON.parse(result.body)).toEqual(["p1", "p2"]);
    });
  });

  describe("when 'trust.proxy' is disabled", () => {
    it("should return an empty array", async () => {
      expect.assertions(1);

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.ips)),
        {
          url    : "/",
          headers: {
            "x-forwarded-for": "client, p1, p2",
          },
        },
      );

      expect(JSON.parse(result.body)).toEqual([]);
    });
  });
});

describe("when X-Forwarded-For is not present", () => {
  it("should return []", async () => {
    expect.assertions(1);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.ips)),
      "/",
    );

    expect(JSON.parse(result.body)).toEqual([]);
  });
});
