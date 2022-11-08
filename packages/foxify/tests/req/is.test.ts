import Foxify from "../../src";

describe("when given a mime type", () => {
  it("should return the type when matching", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      res.end(req.is("application/json"));
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : {},
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });

  it("should return false when not matching", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      expect(req.is("image/jpeg")).toBeFalsy();
      res.end();
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : {},
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.statusCode).toBe(200);
  });

  it("should ignore charset", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      res.end(req.is("application/json"));
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : {},
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });
});

describe("when content-type is not present", () => {
  it("should return false", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      expect(req.is("application/json")).toBeFalsy();
      res.end();
    });

    const result = await app.inject({
      method: "POST",
      url   : "/",
      body  : "{}",
    });

    expect(result.statusCode).toBe(200);
  });
});

describe("when given an extension", () => {
  it("should lookup the mime type", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      res.end(req.is("json"));
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : "{}",
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("json");
  });
});

describe("when given */subtype", () => {
  it("should return the full type when matching", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      res.end(req.is("*/json"));
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : "{}",
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });

  it("should return false when not matching", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      expect(req.is("*/html")).toBeFalsy();
      res.end();
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : "{}",
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.statusCode).toBe(200);
  });

  it("should ignore charset", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      res.end(req.is("*/json"));
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : "{}",
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });
});

describe("when given type/*", () => {
  it("should return the full type when matching", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      res.end(req.is("application/*"));
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : "{}",
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });

  it("should return false when not matching", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      expect(req.is("text/*")).toBeFalsy();
      res.end();
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : "{}",
      headers: {
        "content-type": "application/json",
      },
    });

    expect(result.statusCode).toBe(200);
  });

  it("should ignore charset", async () => {
    expect.assertions(2);

    const app = (new Foxify);

    app.post("/", (req, res) => {
      res.end(req.is("application/*"));
    });

    const result = await app.inject({
      method : "POST",
      url    : "/",
      body   : "{}",
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });
});
