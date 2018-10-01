import * as Request from "../Request";
import * as Response from "../Response";
import * as Fox from "../index";
import * as utils from "../utils";
import { name } from "../../package.json";

const init = (app: Fox) => {
  if (app.enabled("x-powered-by")) {
    const xPoweredBy = utils.string.capitalize(name);

    return function foxify_init(req: Request, res: Response, next: () => void) {
      res.req = req;

      res.setHeader("X-Powered-By", xPoweredBy);

      next();
    };
  }

  return function foxify_init(req: Request, res: Response, next: () => void) {
    res.req = req;

    next();
  };
};

export = init;
