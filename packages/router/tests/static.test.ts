import { METHODS, MethodT } from "@foxify/http";
import Router from "#src/index";

it("should find index route", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  router.on(method, path, handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("should register routes via method aliases", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  router.get(path, handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("should register route with all http methods", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  router.all(path, handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(METHODS.join(", "));
  expect(params).toEqual({});
});

it("should add multiple method handlers to registered route", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/";
  const handler = jest.fn();

  router.route(path).get(handler)
    .post(handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe("GET, POST");
  expect(params).toEqual({});
});

it("should find long static route", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/very/deeply/nested/route/hello/there";
  const handler = jest.fn();

  router.on(method, path, handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("should find short static route", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/user";
  const handler = jest.fn();

  router.on(method, path, handler);

  const { handlers, allowHeader, params } = router.find(method, path);

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe(method);
  expect(params).toEqual({});
});

it("should find static route same radix", () => {
  const router = (new Router);

  const routes = [
    {
      method: "GET",
      url   : "/user",
    },
    {
      method: "GET",
      url   : "/user/comments",
    },
    {
      method: "GET",
      url   : "/user/avatar",
    },
  ];
  const handler = jest.fn();

  routes.forEach(({ method, url }) => router.on(method as MethodT, url, handler));

  const { handlers, allowHeader, params } = router.find(
    "GET",
    "/user/comments",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe("GET");
  expect(params).toEqual({});
});

it("should fallback to the neighbor dynamic route", () => {
  const router = (new Router);

  const routes = [
    {
      method: "GET",
      url   : "/users/memes",
    },
    {
      method: "GET",
      url   : "/users/:id",
    },
  ];
  const handler = jest.fn();

  routes.forEach(({ method, url }) => router.on(method as MethodT, url, handler));

  const { handlers, allowHeader, params } = router.find("GET", "/users/me");

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe("GET");
  expect(params).toEqual({ id: "me" });
});

it("should fallback to the neighbor match all route", () => {
  const router = (new Router);

  const routes = [
    {
      method: "GET",
      url   : "/users/memes",
    },
    {
      method: "GET",
      url   : "/users/*",
    },
  ];
  const handler = jest.fn();

  routes.forEach(({ method, url }) => router.on(method as MethodT, url, handler));

  const { handlers, allowHeader, params } = router.find("GET", "/users/me");

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe("GET");
  expect(params).toEqual({ $: "me" });
});

it("should fallback to the neighbor match all route and not the dynamic route", () => {
  const router = (new Router);

  const routes = [
    {
      method: "GET",
      url   : "/users/memes",
    },
    {
      method: "GET",
      url   : "/users/:id",
    },
    {
      method: "GET",
      url   : "/users/*",
    },
  ];
  const handler = jest.fn();

  routes.forEach(({ method, url }) => router.on(method as MethodT, url, handler));

  const { handlers, allowHeader, params } = router.find(
    "GET",
    "/users/me/info",
  );

  expect(handlers).toEqual([handler]);
  expect(allowHeader).toBe("GET");
  expect(params).toEqual({ $: "me/info" });
});

it("shouldn't find unregistered route", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/some/route";
  const handler = jest.fn();

  router.on(method, path, handler);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/some/other/route",
  );

  expect(handlers).toEqual([]);
  expect(allowHeader).toEqual("");
  expect(params).toEqual({});
});

it("should ignore routes with no handlers registered", () => {
  const router = (new Router);

  const method = "GET";
  const path = "/some/route";

  router.on(method, path);

  const { handlers, allowHeader, params } = router.find(
    method,
    "/some/other/route",
  );

  expect(handlers).toEqual([]);
  expect(allowHeader).toEqual("");
  expect(params).toEqual({});
});
