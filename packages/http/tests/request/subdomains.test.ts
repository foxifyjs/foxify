import { requestSettings } from "../../src";
import { inject, reset } from "../__internals__";

afterEach(reset);

describe("when present", () => {
  it("should return an array", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.subdomains)),
      {
        url    : "/",
        headers: {
          host: "tobi.ferrets.example.com",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('["ferrets","tobi"]');
  });

  it("should work with IPv4 address", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.subdomains)),
      {
        url    : "/",
        headers: {
          host: "127.0.0.1",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });

  it("should work with IPv6 address", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.subdomains)),
      {
        url    : "/",
        headers: {
          host: "[::1]",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });
});

describe("otherwise", () => {
  it("should return an empty array", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.subdomains)),
      {
        url    : "/",
        headers: {
          host: "example.com",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });
});

describe("with no host", () => {
  it("should return an empty array", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => {
      // eslint-disable-next-line no-undefined
      req.headers.host = undefined;

      res.end(JSON.stringify(req.subdomains));
    }, "/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });
});

describe("with trusted X-Forwarded-Host", () => {
  it("should return an array", async () => {
    expect.assertions(2);

    requestSettings({
      "trust.proxy": () => true,
    });

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.subdomains)),
      {
        url    : "/",
        headers: {
          "x-forwarded-host": "tobi.ferrets.example.com",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('["ferrets","tobi"]');
  });
});

describe("when subdomain offset is set", () => {
  describe("when subdomain offset is zero", () => {
    it("should return an array with the whole domain", async () => {
      expect.assertions(2);

      requestSettings({
        "subdomain.offset": 0,
      });

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.subdomains)),
        {
          url    : "/",
          headers: {
            host: "tobi.ferrets.sub.example.com",
          },
        },
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["com","example","sub","ferrets","tobi"]');
    });

    it("should return an array with the whole IPv4", async () => {
      expect.assertions(2);

      requestSettings({
        "subdomain.offset": 0,
      });

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.subdomains)),
        {
          url    : "/",
          headers: {
            host: "127.0.0.1",
          },
        },
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["127.0.0.1"]');
    });

    it("should return an array with the whole IPv6", async () => {
      expect.assertions(2);

      requestSettings({
        "subdomain.offset": 0,
      });

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.subdomains)),
        {
          url    : "/",
          headers: {
            host: "[::1]",
          },
        },
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["[::1]"]');
    });
  });

  describe("when present", () => {
    it("should return an array", async () => {
      expect.assertions(2);

      requestSettings({
        "subdomain.offset": 3,
      });

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.subdomains)),
        {
          url    : "/",
          headers: {
            host: "tobi.ferrets.sub.example.com",
          },
        },
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["ferrets","tobi"]');
    });
  });

  describe("otherwise", () => {
    it("should return an empty array", async () => {
      expect.assertions(2);

      requestSettings({
        "subdomain.offset": 3,
      });

      const result = await inject(
        (req, res) => res.end(JSON.stringify(req.subdomains)),
        {
          url    : "/",
          headers: {
            host: "sub.example.com",
          },
        },
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("[]");
    });
  });
});
