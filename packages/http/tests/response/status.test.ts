import { inject, reset } from "../__internals__";

afterEach(reset);

it("should set the response .statusCode", async () => {
  expect.assertions(2);

  const result = await inject(
    (req, res) => res.status(201).end("Created"),
    "/",
  );

  expect(result.body).toBe("Created");
  expect(result.statusCode).toBe(201);
});
