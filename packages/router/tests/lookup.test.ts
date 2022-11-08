import Router from "../src";
import { inject } from "./__internals__";

it("should call the handler", async () => {
  expect.assertions(2);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest.fn().mockImplementation((req, res) => res.end());

  router.get(path, handler);

  const {
    raw: { req },
  } = await inject(router, path);

  expect(handler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
});

it("should call the middleware & then the handler", async () => {
  expect.assertions(3);

  const router = (new Router);

  const path = "/foo/bar";
  const middleware = jest.fn().mockImplementation((req, res, next) => next());
  const handler = jest.fn().mockImplementation((req, res) => res.end());

  router.get(path, middleware, handler);

  const {
    raw: { req },
  } = await inject(router, path);

  expect(middleware).toBeCalledTimes(1);
  expect(handler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
});

it("should respond with 404 status", async () => {
  expect.assertions(3);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest.fn().mockImplementation((req, res, next) => next());

  router.get(path, handler);

  const {
    raw: { req },
    statusCode,
  } = await inject(router, path);

  expect(handler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
  expect(statusCode).toBe(404);
});

it("should respond with 405 status", async () => {
  expect.assertions(4);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest.fn().mockImplementation((req, res, next) => next());

  router.post(path, handler);

  const {
    raw: { req, res },
    statusCode,
  } = await inject(router, path);

  expect(handler).toBeCalledTimes(0);
  expect(res.getHeader("Allow")).toBe("POST");
  expect(req.params).toEqual({});
  expect(statusCode).toBe(405);
});

it("should call the error handler", async () => {
  expect.assertions(4);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest.fn().mockImplementation(() => {
    throw new Error("TEST");
  });
  const errorHandler = jest.fn().mockImplementation((error, req, res) => {
    res.end(error.message);
  });

  router.get(path, handler);

  router.catch(errorHandler);

  const {
    raw: { req },
    body,
  } = await inject(router, path);

  expect(handler).toBeCalledTimes(1);
  expect(errorHandler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
  expect(body).toEqual("TEST");
});

it("should call the error handler if next is called with an error", async () => {
  expect.assertions(4);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest
    .fn()
    .mockImplementation((req, res, next) => next(new Error("TEST")));
  const errorHandler = jest.fn().mockImplementation((error, req, res) => {
    res.end(error.message);
  });

  router.get(path, handler);

  router.catch(errorHandler);

  const {
    raw: { req },
    body,
  } = await inject(router, path);

  expect(handler).toBeCalledTimes(1);
  expect(errorHandler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
  expect(body).toEqual("TEST");
});

it("should catch Promise errors", async () => {
  expect.assertions(4);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest.fn().mockImplementation(async () => {
    throw new Error("TEST");
  });
  const errorHandler = jest.fn().mockImplementation((error, req, res) => {
    res.end(error.message);
  });

  router.get(path, handler);

  router.catch(errorHandler);

  const {
    raw: { req },
    body,
  } = await inject(router, path);

  expect(handler).toBeCalledTimes(1);
  expect(errorHandler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
  expect(body).toEqual("TEST");
});

it("should fallback to the default error handler", async () => {
  expect.assertions(4);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest.fn().mockImplementation(() => {
    throw new Error("TEST");
  });
  const errorHandler = jest.fn().mockImplementation(() => {
    throw new Error("DAMN");
  });

  router.get(path, handler);

  router.catch(errorHandler);

  const {
    raw: { req },
    body,
  } = await inject(router, {
    url    : path,
    headers: {
      accept: "text/plain",
    },
  });

  expect(handler).toBeCalledTimes(1);
  expect(errorHandler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
  expect(body).toEqual("DAMN");
});

it("should fallback to the default error handler (Promise)", async () => {
  expect.assertions(4);

  const router = (new Router);

  const path = "/foo/bar";
  const handler = jest.fn().mockImplementation(() => {
    throw new Error("TEST");
  });
  const errorHandler = jest.fn().mockImplementation(async () => {
    throw new Error("DAMN");
  });

  router.get(path, handler);

  router.catch(errorHandler);

  const {
    raw: { req },
    body,
  } = await inject(router, {
    url    : path,
    headers: {
      accept: "text/plain",
    },
  });

  expect(handler).toBeCalledTimes(1);
  expect(errorHandler).toBeCalledTimes(1);
  expect(req.params).toEqual({});
  expect(body).toEqual("DAMN");
});

it(
  "should fallback to the default error handler if next is called with an error"
  + " in one of the registered error handlers",
  async () => {
    expect.assertions(4);

    const router = (new Router);

    const path = "/foo/bar";
    const handler = jest
      .fn()
      .mockImplementation((req, res, next) => next(new Error("TEST")));
    // eslint-disable-next-line max-params
    const errorHandler = jest.fn().mockImplementation((error, req, res, next) => {
      next(new Error("DAMN"));
    });

    router.get(path, handler);

    router.catch(errorHandler);

    const {
      raw: { req },
      body,
    } = await inject(router, {
      url    : path,
      headers: {
        accept: "text/plain",
      },
    });

    expect(handler).toBeCalledTimes(1);
    expect(errorHandler).toBeCalledTimes(1);
    expect(req.params).toEqual({});
    expect(body).toEqual("DAMN");
  },
);
