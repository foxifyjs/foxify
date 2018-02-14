import { IncomingMessage, ServerResponse } from 'http'
import * as HttpExeption from './HttpExeption'

declare module Encapsulation { }

class Encapsulation {
  protected _fn: Function

  constructor(fn: (req: IncomingMessage, res: ServerResponse, ...rest: Array<any>) => any) {
    this._fn = fn
  }

  run(req: IncomingMessage, res: ServerResponse, ...rest: Array<any>) {
    try {
      let result = this._fn(req, res, ...rest)

      if (result && Function.isInstance((result as any).then)) {
        (result as Promise<any>).catch((err: Error) => HttpExeption.handle(err, req, res))
      }
    } catch (err) {
      HttpExeption.handle(err, req, res)
    }
  }
}

export = Encapsulation
