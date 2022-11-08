import * as proxyAddr from "proxy-addr";
import { requestSettings } from "../../src";
import { inject, reset } from "../__internals__";

afterEach(reset);

it("should return the protocol string", async () => {
  expect.assertions(1);

  const result = await inject((req, res) => res.end(req.protocol), "/");

  expect(result.body).toBe("http");
});

describe("when 'trust.proxy' is enabled", () => {
  it("should respect X-Forwarded-Proto", async () => {
    expect.assertions(1);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject((req, res) => res.end(req.protocol), {
      url    : "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("https");
  });

  it("should default to the socket addr if X-Forwarded-Proto not present", async () => {
    expect.assertions(1);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject((req, res) => {
      (req.socket as any).encrypted = true;

      res.end(req.protocol);
    }, "/");

    expect(result.body).toBe("https");
  });

  it("should ignore X-Forwarded-Proto if socket addr not trusted", async () => {
    expect.assertions(1);

    requestSettings({
      "trust.proxy": proxyAddr.compile(["10.0.0.1"]),
    });

    const result = await inject((req, res) => res.end(req.protocol), {
      url    : "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("http");
  });

  it("should default to http", async () => {
    expect.assertions(1);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject((req, res) => res.end(req.protocol), "/");

    expect(result.body).toBe("http");
  });

  describe("when trusting hop count", () => {
    it("should respect X-Forwarded-Proto", async () => {
      expect.assertions(1);

      requestSettings({
        "trust.proxy": (ip, i) => i < 1,
      });

      const result = await inject((req, res) => res.end(req.protocol), {
        url    : "/",
        headers: {
          "x-forwarded-proto": "https, http",
        },
      });

      expect(result.body).toBe("https");
    });
  });
});

describe("when 'trust.proxy' is disabled", () => {
  it("should ignore X-Forwarded-Proto", async () => {
    expect.assertions(1);

    const result = await inject((req, res) => res.end(req.protocol), {
      url    : "/",
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    expect(result.body).toBe("http");
  });
});
