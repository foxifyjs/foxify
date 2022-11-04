import { join } from "path";

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Engine {
  export type Callback = (err: Error, str: string) => any;
}

class Engine {

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
    cb?: Engine.Callback,
  ): void {
    this._handler(join(this._path, `${ filename }.${ this._ext }`), opts, cb);
  }

}

export default Engine;
