import Foxify from "foxify";
import { routes, noop } from "./common.js";

const app = (new Foxify);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const router = (new Foxify.Router);

routes.forEach((route) => {
  router.on(route.method, route.url, noop);
});

router.initialize(app);

export default router;
