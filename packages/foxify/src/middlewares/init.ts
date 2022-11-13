import { HandlerT } from "@foxify/router";
import Foxify from "../index.js";

const init = (app: Foxify): HandlerT | null => {
  if (app.disabled("x-powered-by")) return null;

  return function foxifyInit(req, res, next) {
    res.setHeader("X-Powered-By", "Foxify");

    next();
  };
};

export default init;
