import { inject, reset } from "../__internals__";

afterEach(reset);

it("should be true if language accepted", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => {
      expect(req.acceptsLanguages("en-us")).toBeTruthy();
      expect(req.acceptsLanguages("en")).toBeTruthy();

      res.end();
    },
    {
      url    : "/",
      headers: {
        "accept-language": "en;q=.5, en-us",
      },
    },
  );

  expect(result.statusCode).toBe(200);
});

it("should be false if language not accepted", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.end(JSON.stringify(req.acceptsLanguages("es"))),
    {
      url    : "/",
      headers: {
        "accept-language": "en;q=.5, en-us",
      },
    },
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});

describe("when Accept-Language is not present", () => {
  it("should always return true", async () => {
    expect.assertions(4);

    const result = await inject((req, res) => {
      expect(req.acceptsLanguages("en")).toBeTruthy();
      expect(req.acceptsLanguages("es")).toBeTruthy();
      expect(req.acceptsLanguages("jp")).toBeTruthy();

      res.end();
    }, "/");

    expect(result.statusCode).toBe(200);
  });
});
