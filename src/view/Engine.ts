import * as http from 'http'
import * as path from 'path'

declare module Engine {
  type Callback = (err: Error, str: string) => any
}

class Engine {
  protected _path: string
  protected _ext: string
  protected _handler: Function

  constructor(path: string, ext: string, handler: Function) {
    this._path = path
    this._ext = ext
    this._handler = handler
  }

  render(filename: string, opts: Object, cb: Engine.Callback) {
    this._handler(path.join(this._path, `${filename}.${this._ext}`), opts, cb)
  }

  static responsePatch(res: typeof http.ServerResponse, engine?: Engine) {
    res.prototype.render = function(view: string, data: Object, callback?: Engine.Callback) {
      if (!engine) throw new Error('View engine is not specified')

      if (!callback) callback = (err, str) => {
        if (err) throw err

        this.send(str)
      }

      engine.render(view, data, callback)
    }

    return res
  }
}

export = Engine
