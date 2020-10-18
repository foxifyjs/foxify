import Foxify, { Handler } from "..";

const init = (app: Foxify): Handler | null => {
  if (app.disabled("x-powered-by")) return null;

  return function foxify_init(req, res, next) {
    res.setHeader("X-Powered-By", "Foxify");

    next();
  };
};

export default init;
