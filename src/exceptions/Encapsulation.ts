import * as HttpException from "./HttpException";
import * as Request from "../Request";
import * as Response from "../Response";
import * as utils from "../utils";

declare module Encapsulation { }

class Encapsulation {
  protected _fn: (req: Request, res: Response, ...rest: any[]) => any;

  constructor(fn: (req: Request, res: Response, ...rest: any[]) => any) {
    this._fn = fn;
  }

  run(req: Request, res: Response, ...rest: any[]) {
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
