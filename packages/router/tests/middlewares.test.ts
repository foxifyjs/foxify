import Router from "../src";

it("should add middleware", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/foo/bar";
  const middleware = jest.fn();
  const handler = jest.fn();

  router.use(middleware);

  router.on(method, path, handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([middleware, handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("shouldn't add middleware", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/foo/bar";
  const middleware = jest.fn();
  const handler = jest.fn();

  router.on(method, path, handler);

  router.use(middleware);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("shouldn't throw any errors if no middleware is passed", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/foo/bar";
  const handler = jest.fn();

  router.use();

  router.on(method, path, handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});
