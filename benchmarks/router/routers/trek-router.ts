import Router from "trek-router";
import { routes, noop } from "./common.js";

const router = (new Router);

routes.forEach((route) => {
  router.add(route.method, route.url, noop);
});

export default router;
