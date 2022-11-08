import Router from "find-my-way";
import { routes, noop } from "./common.js";

// eslint-disable-next-line new-cap
const router = Router();

routes.forEach((route) => {
  router.on(route.method as any, route.url, noop);
});

export default router;
