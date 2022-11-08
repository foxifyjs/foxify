import { MethodT } from "@foxify/http";
import Router from "../src";

it("should find dynamic route", () => {
  const router = (new Router);

  const method = "GET";
  const handler = jest.fn();

  router.on(method, "/user/lookup/username/:username", handler);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/user/lookup/username/ardalan",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({ username: "ardalan" });
});

it("should add multiple method handlers to the same dynamic route", () => {
  const router = (new Router);

  const postHandler = jest.fn();
  const getHandler = jest.fn();

  router
    .post("/user/lookup/username/:username", postHandler)
    .get("/user/lookup/username/:username", getHandler);

  const { handlers, allowHeader, params } = router.find(
    "GET",
    "/user/lookup/username/ardalan",
  );

  expect(handlers).toEqual([getHandler]);
  expect(allowHeader).toBe("GET, POST");
  expect(params).toEqual({ username: "ardalan" });
});

it("shouldn't allow multiple names for the same parameter", () => {
  const router = (new Router);

  const handler = jest.fn();

  expect(() => router
    .post("/user/lookup/username/:username", handler)
    .get("/user/lookup/username/:notUsername", handler)).toThrow("Can't assign multiple names to the same parameter");

  const { handlers, allowHeader, params } = router.find(
    "GET",
    "/user/lookup/username/ardalan",
  );

  expect(handlers).toEqual([]);
  expect(allowHeader).toBe("POST");
  expect(params).toEqual({ username: "ardalan" });
});

it("should find dynamic route with the param handler", () => {
  const router = (new Router);

  const method = "GET";
  const paramHandler = jest.fn();
  const dummyParamHandler = jest.fn();
  const handler = jest.fn();

  router.param("username", paramHandler);

  router.param("dummy", dummyParamHandler);

  router.on(method, "/user/lookup/username/:username", handler);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/user/lookup/username/ardalan",
  );

  expect(handlers).toEqual([paramHandler, handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({ username: "ardalan" });
});

it("should find mixed dynamic/static route", () => {
  const router = (new Router);

  const method = "GET";
  const handler = jest.fn();

  router.on(method, "event/:id/comments", handler);

  const { handlers, allowHeader, params } = router.find(
    method,
    "event/abcd1234/comments",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({ id: "abcd1234" });
});

it("should fallback to the closest match all route", () => {
  const router = (new Router);

  const routes = [
    {
      method: "GET",
      url   : "/event/:id/comments",
    },
    {
      method: "GET",
      url   : "/event/*",
    },
    {
      method: "GET",
      url   : "/*",
    },
  ];
  const handler = jest.fn();

  routes.forEach(({ method, url }) => router.on(method as MethodT, url, handler));

  const { handlers, allowHeader, params } = router.find(
    "GET",
    "/event/some/route",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe("GET");
  expect(params).toEqual({ $: "some/route" });
});

it("shouldn't find unregistered route", () => {
  const router = (new Router);

  const method = "GET";
  const handler = jest.fn();

  router.on(method, "event/:id", handler);

  const { handlers, allowHeader, params } = router.find(
    method,
    "event/abcd1234/comments",
  );

  expect(handlers).toEqual([]);
  expect(allowHeader).toEqual("");
  expect(params).toEqual({});
});
