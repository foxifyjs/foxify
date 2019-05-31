import * as Foxify from "../../src";

it("should return the parsed pathname", async () => {
  expect.assertions(1);

  const app = new Foxify();

  app.use((req, res) => {
    res.end(req.path);
  });

  const result = await app.inject("/login?redirect=/post/1/comments");

  expect(result.body).toBe("/login");
});
