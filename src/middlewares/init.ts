import Foxify from "..";
import { name } from "../../package.json";
import * as utils from "../utils";

const init = (app: Foxify): Foxify.Handler | null => {
  if (app.disabled("x-powered-by")) return null;

  const xPoweredBy = utils.string.capitalize(name);

  return function foxify_init(req, res, next) {
    res.setHeader("X-Powered-By", xPoweredBy);

    next();
  };
};

export default init;
