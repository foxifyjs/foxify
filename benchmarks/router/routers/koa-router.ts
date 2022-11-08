import Router from "koa-router";
import { routes, noop } from "./common.js";

const router = (new Router);

routes.forEach((route) => {
  if (route.method === "GET") {
    router.get(
      route.url === "/static/*" ? /^\/static(?:\/|$)/ : route.url,
      noop,
    );
  } else {
    router.post(route.url, noop);
  }
});

export default router;
