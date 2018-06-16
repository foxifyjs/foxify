import { IncomingMessage, ServerResponse } from "http";
import * as HttpException from "./HttpException";
import * as utils from "../utils";

declare module Encapsulation { }

class Encapsulation {
  protected _fn: (req: IncomingMessage, res: ServerResponse, ...rest: any[]) => any;

  constructor(fn: (req: IncomingMessage, res: ServerResponse, ...rest: any[]) => any) {
    this._fn = fn;
  }

  run(req: IncomingMessage, res: ServerResponse, ...rest: any[]) {
    try {
      const result = this._fn(req, res, ...rest);

      if (result && utils.function.isFunction((result as any).then))
        (result as Promise<any>).catch((err: Error) => {
          HttpException.handle(err, req, res);

          if (process.env.NODE_ENV === "development") console.error("Encapsulation: ", err);
        });
    } catch (err) {
      HttpException.handle(err, req, res);

      if (process.env.NODE_ENV === "development") console.error("Encapsulation: ", err);
    }
  }
}

export = Encapsulation;
