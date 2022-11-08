import { inject, reset } from "../__internals__";

afterEach(reset);

it("should default to {}", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.end(JSON.stringify(req.query)),
    "/",
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("{}");
});

it("should default to parse complex keys", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.end(JSON.stringify(req.query)),
    "/?user[name]=tj",
  );

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe('{"user":{"name":"tj"}}');
});
