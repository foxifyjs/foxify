import { http } from "../constants";
import * as Request from "../Request";
import * as Response from "../Response";
import * as events from "../events";

const handle = (error: any, req: Request, res: Response) => {
  events.emit(`error-${error.code || http.INTERNAL_SERVER_ERROR}` as any, error, req, res);

  // if (process.env.NODE_ENV === "development") console.error("Encapsulation: ", error);
};

declare module Encapsulation { }

class Encapsulation {
  protected _fn: (req: Request, res: Response, ...rest: any[]) => any;

  constructor(fn: (req: Request, res: Response, ...rest: any[]) => any) {
    this._fn = fn;
  }

  run(req: Request, res: Response, ...rest: any[]) {
    try {
      const result = this._fn(req, res, ...rest);

      if (result instanceof Promise) result.catch((err) => handle(err, req, res));
    } catch (err) {
      handle(err, req, res);
    }
  }
}

export = Encapsulation;
