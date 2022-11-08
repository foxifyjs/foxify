import { inject, reset } from "../__internals__";

afterEach(reset);

describe("when given a mime type", () => {
  it("should return the type when matching", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(req.is("application/json")),
      {
        url    : "/",
        method : "POST",
        body   : {},
        headers: {
          "content-type": "application/json",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });

  it("should return false when not matching", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.is("image/jpeg"))),
      {
        url    : "/",
        method : "POST",
        body   : {},
        headers: {
          "content-type": "application/json",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("false");
  });

  it("should ignore charset", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(req.is("application/json")),
      {
        url    : "/",
        method : "POST",
        body   : {},
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });
});

describe("when content-type is not present", () => {
  it("should return false", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.is("application/json"))),
      {
        url   : "/",
        method: "POST",
        body  : "{}",
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("false");
  });
});

describe("when given an extension", () => {
  it("should lookup the mime type", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.end(req.is("json")), {
      url    : "/",
      method : "POST",
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

    const result = await inject((req, res) => res.end(req.is("*/json")), {
      url    : "/",
      method : "POST",
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

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.is("*/html"))),
      {
        url    : "/",
        method : "POST",
        body   : "{}",
        headers: {
          "content-type": "application/json",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("false");
  });

  it("should ignore charset", async () => {
    expect.assertions(2);

    const result = await inject((req, res) => res.end(req.is("*/json")), {
      url    : "/",
      method : "POST",
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

    const result = await inject(
      (req, res) => res.end(req.is("application/*")),
      {
        url    : "/",
        method : "POST",
        body   : "{}",
        headers: {
          "content-type": "application/json",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });

  it("should return false when not matching", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(JSON.stringify(req.is("text/*"))),
      {
        url    : "/",
        method : "POST",
        body   : "{}",
        headers: {
          "content-type": "application/json",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("false");
  });

  it("should ignore charset", async () => {
    expect.assertions(2);

    const result = await inject(
      (req, res) => res.end(req.is("application/*")),
      {
        url    : "/",
        method : "POST",
        body   : "{}",
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      },
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("application/json");
  });
});
