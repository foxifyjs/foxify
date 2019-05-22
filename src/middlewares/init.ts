import * as Foxify from "../index";
import * as utils from "../utils";
import { name } from "../../package.json";

const init = (app: Foxify): Foxify.Handler | null => {
  if (app.disabled("x-powered-by")) return null;

  const xPoweredBy = utils.string.capitalize(name);

  return function foxify_init(req, res, next) {
    res.setHeader("X-Powered-By", xPoweredBy);

    next();
  };
};

export default init;
