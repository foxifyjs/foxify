import { inject, reset } from "../__internals__";

afterEach(reset);

it("should be true if encoding accepted", async () => {
  expect.assertions(3);

  const result = await inject(
    (req, res) => {
      expect(req.acceptsEncodings("gzip")).toBeTruthy();
      expect(req.acceptsEncodings("deflate")).toBeTruthy();

      res.end();
    },
    {
      url    : "/",
      headers: {
        "accept-encoding": " gzip, deflate",
      },
    },
  );

  expect(result.statusCode).toBe(200);
});

it("should be false if encoding not accepted", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.end(JSON.stringify(req.acceptsEncodings("bogus"))),
    {
      url    : "/",
      headers: {
        "accept-encoding": " gzip, deflate",
      },
    },
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("false");
});
