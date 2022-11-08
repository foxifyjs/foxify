import Router from "../src";

it("should add sub-router", () => {
  const router = (new Router);
  const subRouter = (new Router);

  const method = "GET";
  const path = "/foo/bar";
  const handler = jest.fn();

  subRouter.on(method, path, handler);

  router.use(subRouter);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("should respect sub-router prefix", () => {
  const router = (new Router);
  const subRouter = new Router("/prefix");

  const method = "GET";
  const handler = jest.fn();

  subRouter.on(method, "/foo/bar", handler);

  router.use(subRouter);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/prefix/foo/bar",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("should apply current prefix to sub-router", () => {
  const router = new Router("/prefix");
  const subRouter = (new Router);

  const method = "GET";
  const handler = jest.fn();

  subRouter.on(method, "/foo/bar", handler);

  router.use(subRouter);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/prefix/foo/bar",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("should respect sub-router prefix & apply current prefix to sub-router", () => {
  const router = new Router("/prefix-1");
  const subRouter = new Router("/prefix-2");

  const method = "GET";
  const handler = jest.fn();

  subRouter.on(method, "/foo/bar", handler);

  router.use(subRouter);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/prefix-1/prefix-2/foo/bar",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});
