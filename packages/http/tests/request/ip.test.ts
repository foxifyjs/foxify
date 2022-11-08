import { requestSettings } from "../../src";
import { inject, reset } from "../__internals__";

/**
 * Get the local client address depending on AF_NET of server
 */

function getExpectedClientAddress(address: string): string {
  return address === "::" ? "::ffff:127.0.0.1" : "127.0.0.1";
}

afterEach(reset);

describe("when X-Forwarded-For is present", () => {
  describe("when 'trust.proxy' is enabled", () => {
    it("should return the client addr", async () => {
      expect.assertions(1);

      requestSettings({
        "trust.proxy": () => true,
      });

      const result = await inject((req, res) => res.end(req.ip), {
        url    : "/",
        headers: {
          "x-forwarded-for": "client, p1, p2",
        },
      });

      expect(result.body).toBe("client");
    });

    it("should return the addr after trusted proxy", async () => {
      expect.assertions(1);

      requestSettings({
        "trust.proxy": (ip, i) => i < 2,
      });

      const result = await inject((req, res) => res.end(req.ip), {
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

      const result = await inject(
        (req, res) => res.end(JSON.stringify({
          ip     : req.ip,
          address: req.socket.remoteAddress,
        })),
        {
          url    : "/",
          headers: {
            "x-forwarded-for": "client, p1, p2",
          },
        },
      );

      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.ip).toEqual(getExpectedClientAddress(body.address));
    });
  });
});

describe("when X-Forwarded-For is not present", () => {
  it("should return the remote address", async () => {
    expect.assertions(2);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject(
      (req, res) => res.end(JSON.stringify({
        ip     : req.ip,
        address: req.socket.remoteAddress,
      })),
      "/",
    );

    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.ip).toEqual(getExpectedClientAddress(body.address));
  });
});
