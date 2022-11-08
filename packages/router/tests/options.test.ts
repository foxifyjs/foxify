import Router from "../src";

it("should return the empty options", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  router.on(method, path, handler);

  const { handlers, allowHeader, options, params } = router.find("POST", path);

  expect(handlers).toEqual([]);
  expect(allowHeader).toBe(method);
  expect(options).toEqual({ schema: { response: {} } });
  expect(params).toEqual({});
});

it("should return the default options", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  router.on(method, path, handler);

  const { handlers, allowHeader, options, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(options).toEqual({ schema: { response: {} } });
  expect(params).toEqual({});
});

it("should return the correct options", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  router.on(
    method,
    path,
    {
      schema: {
        response: {
          200: {
            type : "string",
            title: "Example Schema with string date-time field",
          },
        },
      },
    },
    handler,
  );

  const { handlers, allowHeader, options, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(typeof options!.schema.response["200"]).toBe("function");
  expect(params).toEqual({});
});

it("should respect sub-router options", () => {
  const router = (new Router);
  const subRouter = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  subRouter.on(
    method,
    path,
    {
      schema: {
        response: {
          200: {
            type : "string",
            title: "Example Schema with string date-time field",
          },
        },
      },
    },
    handler,
  );

  router.use(subRouter);

  const { handlers, allowHeader, options, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(typeof options!.schema.response["200"]).toBe("function");
  expect(params).toEqual({});
});
