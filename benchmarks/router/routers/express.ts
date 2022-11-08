import { Router } from "express";
import { routes, noop } from "./common.js";

// eslint-disable-next-line new-cap
const router = Router();

routes.forEach((route) => {
  if (route.method === "GET") router.route(route.url).get(noop);
  else router.route(route.url).post(noop);
});

export default router as any;
