import Foxify from "../../src";

it("should get the response header field", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/x-foo");
    res.send(res.get("Content-Type") as any);
  });

  const result = await app.inject("/");

  expect(result.statusCode).toBe(200);
  expect(result.body).toBe("text/x-foo");
});
