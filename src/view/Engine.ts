import * as http from "http";
import * as path from "path";

declare module Engine {
  type Callback = (err: Error, str: string) => any;
}

class Engine {
  protected _path: string;
  protected _ext: string;
  protected _handler: (...args: any[]) => void;

  constructor(path: string, ext: string, handler: () => void) {
    this._path = path;
    this._ext = ext;
    this._handler = handler;
  }

  render(filename: string, opts: object = {}, cb?: Engine.Callback) {
    this._handler(path.join(this._path, `${filename}.${this._ext}`), opts, cb);
  }
}

export = Engine;
