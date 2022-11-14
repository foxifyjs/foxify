import { join } from "node:path";

export default class Engine {

  protected _ext: string;

  protected _handler: (...args: any[]) => void;

  protected _path: string;

  public constructor(path: string, ext: string, handler: () => void) {
    this._path = path;
    this._ext = ext;
    this._handler = handler;
  }

  public render(
    filename: string,
    opts: Record<string, unknown> = {},
    cb?: CallbackT,
  ): void {
    this._handler(join(this._path, `${ filename }.${ this._ext }`), opts, cb);
  }

}

export type CallbackT = (err: Error, str: string) => void;
