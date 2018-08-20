import * as parseUrl from "parseurl";
import * as qs from "qs";
import * as Request from "../Request";
import * as Response from "../Response";
import * as Fox from "../index";
import * as utils from "../utils";
import { name } from "../../package.json";

const init = (app: Fox) => {
  const queryParse: (...args: any[]) => any = app.get("query.parser") || qs.parse;

  if (app.enabled("x-powered-by")) {
    const xPoweredBy = utils.string.capitalize(name);

    return function foxify_init(req: Request, res: Response, next: () => void) {
      req.res = res;
      res.req = req;

      res.setHeader("X-Powered-By", xPoweredBy);

      req.query = req.query || queryParse((parseUrl(req) as any).query, {});

      next();
    };
  }

  return function foxify_init(req: Request, res: Response, next: () => void) {
    req.res = res;
    res.req = req;

    req.query = req.query || queryParse((parseUrl(req) as any).query, {});

    next();
  };
};

export = init;
