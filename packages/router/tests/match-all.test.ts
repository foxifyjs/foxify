import Router from "../src";

it("should find match all route", () => {
  const router = (new Router);

  const method = "GET";
  const handler = jest.fn();

  router.on(method, "/static/*file", handler);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/static/some/file.ext",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({ file: "some/file.ext" });
});
