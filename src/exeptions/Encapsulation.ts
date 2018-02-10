import { IncomingMessage, ServerResponse } from 'http'
import * as HttpExeption from './HttpExeption'

declare module Encapsulation { }

class Encapsulation {
  protected _fn: Function

  constructor(fn: Function) {
    this._fn = fn

    // process.on('uncaughtException', function(err) {
    //   console.log('Caught exception: ' + err);
    // })
    //
    // process.on('unhandledRejection', function(err) {
    //   console.log('Caught exception: ' + err);
    // })
  }

  run(req: IncomingMessage, res: ServerResponse) {
    try {
      this._fn(req, res)
    } catch (err) {
      HttpExeption.handle(err, req, res)
    }
  }
}

export = Encapsulation
