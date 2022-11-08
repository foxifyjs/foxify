import Router from "koa-tree-router";
import { routes, noop } from "./common.js";

const router = (new Router);

routes.forEach((route) => {
  router.on(
    route.method,
    route.url === "/static/*" ? "/static/*file" : route.url,
    noop,
  );
});

export default router as any;
