import foxify from "@foxify/router";
import { routes, noop } from "./common.js";

const Router = foxify.default;

const router = (new Router);

routes.forEach((route) => {
  router.on(route.method as any, route.url, noop);
});

export default router;
