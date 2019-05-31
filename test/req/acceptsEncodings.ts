import * as Foxify from "../../src";

it("should be true if encoding accepted", async () => {
  expect.assertions(3);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.acceptsEncodings("gzip")).toBeTruthy();
    expect(req.acceptsEncodings("deflate")).toBeTruthy();
    res.end();
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "accept-encoding": " gzip, deflate",
    },
  });

  expect(result.statusCode).toBe(200);
});

it("should be false if encoding not accepted", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.use((req, res) => {
    expect(req.acceptsEncodings("bogus")).toBeFalsy();
    res.end();
  });

  const result = await app.inject({
    url: "/",
    headers: {
      "accept-encoding": " gzip, deflate",
    },
  });

  expect(result.statusCode).toBe(200);
});
