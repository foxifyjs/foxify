import { http } from "../constants";
import * as Request from "../Request";
import * as Response from "../Response";
import * as events from "../events";

declare module Encapsulation { }

class Encapsulation {
  protected _fn: (req: Request, res: Response, ...rest: any[]) => any;

  constructor(fn: (req: Request, res: Response, ...rest: any[]) => any) {
    this._fn = fn;
  }

  async run(req: Request, res: Response, ...rest: any[]) {
    try {
      await this._fn(req, res, ...rest);
    } catch (err) {
      events.emit(`error-${err.code || http.INTERNAL_SERVER_ERROR}` as any, err, req, res);

      // if (process.env.NODE_ENV === "development") console.error("Encapsulation: ", err);
    }
  }
}

export = Encapsulation;
