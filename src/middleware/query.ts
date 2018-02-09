import * as http from 'http'
import * as parseUrl from 'parseurl'
import * as qs from 'qs'

const query = (options: Object | Function) => {
  let opts: OBJ | undefined = Object.assign({}, options)
  let queryparse = qs.parse

  if (Function.isInstance(options)) {
    queryparse = <(str: string, options?: qs.IParseOptions) => any>options
    opts = undefined
  }

  if (opts !== undefined && opts.allowPrototypes === undefined) {
    // back-compat for qs module
    opts.allowPrototypes = true
  }

  return (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
    if (!req.query) {
      let val = (parseUrl(req) as any).query

      req.query = queryparse(val, opts)
    }

    next()
  }
}

export = query
