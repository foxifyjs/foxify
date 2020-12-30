import Foxify from "../../src";

describe("when present", () => {
  it("should return an array", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.send(req.subdomains);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "tobi.ferrets.example.com",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('["ferrets","tobi"]');
  });

  it("should work with IPv4 address", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.send(req.subdomains);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "127.0.0.1",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });

  it("should work with IPv6 address", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.send(req.subdomains);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "[::1]",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });
});

describe("otherwise", () => {
  it("should return an empty array", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.get("/", (req, res) => {
      res.send(req.subdomains);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        host: "example.com",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });
});

describe("with no host", () => {
  it("should return an empty array", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.get("/", (req, res) => {
      req.headers.host = undefined;
      res.send(req.subdomains);
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("[]");
  });
});

describe("with trusted X-Forwarded-Host", () => {
  it("should return an array", async () => {
    expect.assertions(2);

    const app = new Foxify();

    app.set("trust.proxy", true);

    app.get("/", (req, res) => {
      res.send(req.subdomains);
    });

    const result = await app.inject({
      url: "/",
      headers: {
        "x-forwarded-host": "tobi.ferrets.example.com",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('["ferrets","tobi"]');
  });
});

describe("when subdomain offset is set", () => {
  describe("when subdomain offset is zero", () => {
    it("should return an array with the whole domain", async () => {
      expect.assertions(2);

      const app = new Foxify();

      app.set("subdomain.offset", 0);

      app.get("/", (req, res) => {
        res.send(req.subdomains);
      });

      const result = await app.inject({
        url: "/",
        headers: {
          host: "tobi.ferrets.sub.example.com",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["com","example","sub","ferrets","tobi"]');
    });

    it("should return an array with the whole IPv4", async () => {
      expect.assertions(2);

      const app = new Foxify();

      app.set("subdomain.offset", 0);

      app.get("/", (req, res) => {
        res.send(req.subdomains);
      });

      const result = await app.inject({
        url: "/",
        headers: {
          host: "127.0.0.1",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["127.0.0.1"]');
    });

    it("should return an array with the whole IPv6", async () => {
      expect.assertions(2);

      const app = new Foxify();

      app.set("subdomain.offset", 0);

      app.get("/", (req, res) => {
        res.send(req.subdomains);
      });

      const result = await app.inject({
        url: "/",
        headers: {
          host: "[::1]",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["[::1]"]');
    });
  });

  describe("when present", () => {
    it("should return an array", async () => {
      expect.assertions(2);

      const app = new Foxify();

      app.set("subdomain.offset", 3);

      app.get("/", (req, res) => {
        res.send(req.subdomains);
      });

      const result = await app.inject({
        url: "/",
        headers: {
          host: "tobi.ferrets.sub.example.com",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('["ferrets","tobi"]');
    });
  });

  describe("otherwise", () => {
    it("should return an empty array", async () => {
      expect.assertions(2);

      const app = new Foxify();

      app.set("subdomain.offset", 3);

      app.get("/", (req, res) => {
        res.send(req.subdomains);
      });

      const result = await app.inject({
        url: "/",
        headers: {
          host: "sub.example.com",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("[]");
    });
  });
});
