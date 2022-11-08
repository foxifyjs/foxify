import { Router } from "@hapi/call";
import { routes, noop } from "./common.js";

const router = (new Router);

routes.forEach((route) => {
  router.add({
    method: route.method.toLowerCase(),
    path  : route.url,
  }, noop);
});

export default router;
