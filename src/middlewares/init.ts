import * as Request from "../Request";
import * as Response from "../Response";
import * as Foxify from "../index";
import * as utils from "../utils";
import { name } from "../../package.json";

const init = (app: Foxify) => {
  if (app.disabled("x-powered-by")) return null;

  const xPoweredBy = utils.string.capitalize(name);

  return function foxify_init(req: Request, res: Response, next: () => void) {
    res.setHeader("X-Powered-By", xPoweredBy);

    next();
  };
};

export = init;
