import * as http from "http";
import * as Fox from "../index";
import * as utils from "../utils";
import { name } from "../../package.json";

const init = (app: Fox) => {
  if (app.enabled("x-powered-by")) {
    const xPoweredBy = utils.string.capitalize(name);

    return (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
      req.res = res;
      res.req = req;

      res.setHeader("X-Powered-By", xPoweredBy);

      next();
    };
  }

  return (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
    req.res = res;
    res.req = req;

    next();
  };
};

export = init;
