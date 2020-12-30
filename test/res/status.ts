import Foxify from "../../src";

it("should set the response .statusCode", async () => {
  expect.assertions(2);

  const app = new Foxify();

  app.get("/", (req, res) => {
    res.status(201).end("Created");
  });

  const res = await app.inject({
    url: "/",
    method: "GET",
  });

  expect(res.body).toBe("Created");
  expect(res.statusCode).toBe(201);
});
