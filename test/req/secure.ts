import Foxify from "../../src";

describe("when X-Forwarded-Proto is missing", () => {
  it("should return false when http", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.send(req.secure ? "yes" : "no");
    });

    const result = await app.inject({
      url: "/",
    });

    expect(result.body).toBe("no");
  });
});

describe("when X-Forwarded-Proto is present", () => {
  it("should return false when http", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.send(req.secure ? "yes" : "no");
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("no");
  });

  it('should return true when "trust.proxy" is enabled', async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.set("trust.proxy", true);

    app.get("/", (req, res) => {
      res.send(req.secure ? "yes" : "no");
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("yes");
  });

  it("should return false when initial proxy is http", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.set("trust.proxy", true);

    app.get("/", (req, res) => {
      res.send(req.secure ? "yes" : "no");
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-proto": "http, https",
      },
    });

    expect(result.body).toBe("no");
  });

  it("should return true when initial proxy is https", async () => {
    expect.assertions(1);

    const app = new Foxify();

    app.set("trust.proxy", true);

    app.get("/", (req, res) => {
      res.send(req.secure ? "yes" : "no");
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-proto": "https, http",
      },
    });

    expect(result.body).toBe("yes");
  });

  describe("when 'trust.proxy' trusting hop count", () => {
    it("should respect X-Forwarded-Proto", async () => {
      expect.assertions(1);

      const app = new Foxify();

      app.set("trust.proxy", 1);

      app.get("/", (req, res) => {
        res.send(req.secure ? "yes" : "no");
      });

      const result = await app.inject({
        url: "/",
        headers: {
          "x-forwarded-proto": "https",
        },
      });

      expect(result.body).toBe("yes");
    });
  });
});
