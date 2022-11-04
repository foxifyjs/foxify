import Foxify from "../../src";

describe("when X-Forwarded-For is present", () => {
  describe("when 'trust.proxy' is enabled", () => {
    it("should return an array of the specified addresses", async () => {
      expect.assertions(1);

      const app = (new Foxify);

      app.set("trust.proxy", true);

      app.get("/", (req, res) => {
        res.send(req.ips);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          "x-forwarded-for": "client, p1, p2",
        },
      });

      expect(JSON.parse(result.body)).toEqual(["client", "p1", "p2"]);
    });

    it("should stop at first untrusted", async () => {
      expect.assertions(1);

      const app = (new Foxify);

      app.set("trust.proxy", 2);

      app.get("/", (req, res) => {
        res.send(req.ips);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          "x-forwarded-for": "client, p1, p2",
        },
      });

      expect(JSON.parse(result.body)).toEqual(["p1", "p2"]);
    });
  });

  describe("when 'trust.proxy' is disabled", () => {
    it("should return an empty array", async () => {
      expect.assertions(1);

      const app = (new Foxify);

      app.get("/", (req, res) => {
        res.send(req.ips);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          "x-forwarded-for": "client, p1, p2",
        },
      });

      expect(JSON.parse(result.body)).toEqual([]);
    });
  });
});

describe("when X-Forwarded-For is not present", () => {
  it("should return []", async () => {
    expect.assertions(1);

    const app = (new Foxify);

    app.get("/", (req, res) => {
      res.send(req.ips);
    });

    const result = await app.inject({
      url: "/",
    });

    expect(JSON.parse(result.body)).toEqual([]);
  });
});
