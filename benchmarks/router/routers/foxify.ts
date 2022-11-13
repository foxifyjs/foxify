import Router from "@foxify/router";
import { routes, noop } from "./common.js";

const router = (new Router);

routes.forEach((route) => {
  router.on(route.method as any, route.url, noop);
});

export default router;
