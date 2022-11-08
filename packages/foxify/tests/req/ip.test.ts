import Foxify from "../../src";

/**
 * Get the local client address depending on AF_NET of server
 */
function getExpectedClientAddress(address: string): string {
  return address === "::" ? "::ffff:127.0.0.1" : "127.0.0.1";
}

describe("when X-Forwarded-For is present", () => {
  describe("when 'trust.proxy' is enabled", () => {
    it("should return the client addr", async () => {
      expect.assertions(1);

      const app = (new Foxify);

      app.set("trust.proxy", true);

      app.get("/", (req, res) => {
        res.send(req.ip);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          "x-forwarded-for": "client, p1, p2",
        },
      });

      expect(result.body).toBe("client");
    });

    it("should return the addr after trusted proxy", async () => {
      expect.assertions(1);

      const app = (new Foxify);

      app.set("trust.proxy", 2);

      app.get("/", (req, res) => {
        res.send(req.ip);
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          "x-forwarded-for": "client, p1, p2",
        },
      });

      expect(result.body).toBe("p1");
    });
  });

  describe("when 'trust.proxy' is disabled", () => {
    it("should return the remote address", async () => {
      expect.assertions(2);

      const app = (new Foxify);

      app.get("/", (req, res) => {
        res.send({
          ip     : req.ip,
          address: req.socket.remoteAddress,
        });
      });

      const result = await app.inject({
        url    : "/",
        headers: {
          "x-forwarded-for": "client, p1, p2",
        },
      });

      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.ip).toEqual(getExpectedClientAddress(body.address));
    });
  });
});

describe("when X-Forwarded-For is not present", () => {
  it("should return the remote address", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.set("trust.proxy", true);

    app.get("/", (req, res) => {
      res.send({
        ip     : req.ip,
        address: req.socket.remoteAddress,
      });
    });

    const result = await app.inject({
      url: "/",
    });

    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.ip).toEqual(getExpectedClientAddress(body.address));
  });
});
