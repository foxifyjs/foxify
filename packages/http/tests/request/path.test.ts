import { inject, reset } from "../__internals__";

afterEach(reset);

it("should return the parsed pathname", async () => {
  expect.assertions(1);

  const result = await inject(
    (req, res) => res.end(req.path),
    "/login#foo?redirect=/post/1/comments",
  );

  expect(result.body).toBe("/login");
});
