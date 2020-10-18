import Foxify from "../../src";

it("should be true if language accepted", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.acceptsLanguages("en-us")).toBeTruthy();
    expect(req.acceptsLanguages("en")).toBeTruthy();
    res.end();
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "accept-language": "en;q=.5, en-us",
    },
  });

  expect(result.statusCode).toBe(200);
});

it("should be false if language not accepted", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.acceptsLanguages("es")).toBeFalsy();
    res.end();
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "accept-language": "en;q=.5, en-us",
    },
  });

  expect(result.statusCode).toBe(200);
});

describe("when Accept-Language is not present", () => {
  it("should always return true", async () => {
    expect.assertions(4);

    const app = new Foxify();

    app.use((req, res) => {
      expect(req.acceptsLanguages("en")).toBeTruthy();
      expect(req.acceptsLanguages("es")).toBeTruthy();
      expect(req.acceptsLanguages("jp")).toBeTruthy();
      res.end();
    });

    const result = await app.inject("/");

    expect(result.statusCode).toBe(200);
  });
});
