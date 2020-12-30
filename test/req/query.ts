import Foxify from "../../src";

it("should default to {}", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.send(req.query as any);
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("{}");
});

it("should default to parse complex keys", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.send(req.query as any);
  });

  const result = await app.inject("/?user[name]=tj");

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe('{"user":{"name":"tj"}}');
});
