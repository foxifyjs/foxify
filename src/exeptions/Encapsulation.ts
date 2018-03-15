import { IncomingMessage, ServerResponse } from "http";
import * as HttpExeption from "./HttpExeption";

declare module Encapsulation { }

class Encapsulation {
  protected _fn: (req: IncomingMessage, res: ServerResponse, ...rest: any[]) => any;

  constructor(fn: (req: IncomingMessage, res: ServerResponse, ...rest: any[]) => any) {
    this._fn = fn;
  }

  run(req: IncomingMessage, res: ServerResponse, ...rest: any[]) {
    try {
      const result = this._fn(req, res, ...rest);

      if (result && Function.isInstance((result as any).then))
        (result as Promise<any>).catch((err: Error) => {
          HttpExeption.handle(err, req, res);

          if (process.env.NODE_ENV === "development") console.error(err);
        });
    } catch (err) {
      HttpExeption.handle(err, req, res);

      if (process.env.NODE_ENV === "development") console.error(err);
    }
  }
}

export = Encapsulation;
